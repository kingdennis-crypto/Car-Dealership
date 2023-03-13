// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0 <0.9.0;

import "../node_modules/@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "../node_modules/@openzeppelin/contracts/access/Ownable.sol";
import "../node_modules/@openzeppelin/contracts/utils/Counters.sol";
import "../node_modules/@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";

contract CarDealership is Ownable, ERC721Enumerable {
  using Counters for Counters.Counter;
  Counters.Counter private _tokenIdCounter;

  constructor() ERC721("carTokens", "CAR") {}

  receive() external payable {}

  fallback() external payable {}

  string constant CAR_DOES_NOT_EXIST = "Car not found";
  string constant CANT_BUY_OWN_CAR = "You cannot buy your own car";
  string constant CAR_ALREADY_SOLD = "The car has already been sold";
  string constant INSUFFICIENT_FUNDS = "Insufficient funds for buying the car";
  string constant CAR_NOT_SOLD = "The car has not been sold yet";
  string constant ONLY_BUYER = "Only the buyer can retrieve this car";
  string constant FAILED_TO_SENT_ETHER = "Failed to transfer ether";
  string constant ONLY_BUYER_CANCEL = "Only the buyer can cancel this order";

  struct Car {
    // The license plate, chassis number, brand, type, and colour of the car
    address owner;
    uint256 tokenId;
    string licensePlate;
    string chassisNumber;
    string brand;
    string carType;
    string colour;
    uint256 mileage;
    bool sold;
    address buyer;
    uint256 price;
    string metadataUri;
  }

  mapping(uint256 => Car) private cars;

  event CarSold(uint256 indexed tokenId, address indexed buyer, uint256 price);

  function mintCar(
    address _owner,
    string memory _licensePlate,
    string memory _chassisNumber,
    string memory _brand,
    string memory _carType,
    string memory _colour,
    uint256 _mileage,
    uint256 _price,
    string memory _metadataUri
  ) public returns (uint256) {
    _tokenIdCounter.increment();

    uint256 newCarId = _tokenIdCounter.current();
    _safeMint(_owner, newCarId);

    cars[newCarId] = Car(_owner, newCarId, _licensePlate, _chassisNumber, _brand, _carType, _colour, _mileage, false, address(0), _price, _metadataUri);

    return newCarId;
  }

  /// @notice Allows a user to buy a car with a given token ID.
  /// @param _tokenId the ID of the car being purchased
  /// @dev Requires that the car with the given token exists, is not already sold, and that the buyer is not the owner of the car
  function buyCar(uint256 _tokenId) public payable {
    require(_exists(_tokenId), CAR_DOES_NOT_EXIST);
    Car storage _car = cars[_tokenId];

    address _owner = ownerOf(_tokenId);
    require(_owner != msg.sender, CANT_BUY_OWN_CAR);
    require(!_car.sold, CAR_ALREADY_SOLD);
    require(msg.value >= _car.price, INSUFFICIENT_FUNDS);

    _car.sold = true;
    _car.buyer = msg.sender;
    // TODO: Change so that the money will be set on the contract as a broker

    emit CarSold(_tokenId, msg.sender, msg.value);
  }

  /// @notice Allows the buyer to cancel an order and get the money back
  /// @param _tokenId the ID of the car being purchased
  function cancelCarOrder(uint256 _tokenId) public {
  // TODO: After cancelation check what happens with the money
    require(_exists(_tokenId), CAR_DOES_NOT_EXIST);
    Car storage _car = cars[_tokenId];
    require(_car.sold, CAR_NOT_SOLD);
    require(msg.sender == _car.buyer, ONLY_BUYER_CANCEL);

    uint256 _price = _car.price * 1 ether;

    // Transfer the money back to the buyer
    (bool _sent, ) = payable(_car.buyer).call{value: _price}("");
    require(_sent, FAILED_TO_SENT_ETHER);

    // Reset the car's sold status, buyer, price, and owner
    _car.sold = false;
    _car.buyer = address(0);
    _car.price = 0;
  }

  /// @notice Allows the buyer to retrieve the purchased car.
  /// @param _tokenId The ID of the car to retrieve
  function retrieveCar(uint256 _tokenId) public payable {
    // Check if the car exists
    require(_exists(_tokenId), CAR_DOES_NOT_EXIST);
    // Retrieve the car and check the sold status and the buyer
    Car storage _car = cars[_tokenId];
    require(_car.sold, CAR_NOT_SOLD);
    require(msg.sender == _car.buyer, ONLY_BUYER);

    address _owner = ownerOf(_tokenId);
    address _buyer = _car.buyer;

    // Get the price of the car in WEI
    uint256 _price = _car.price * 1 ether;

    // Transfer the price of the car to the original owner
    (bool sent, ) = payable(_owner).call{value: _price}("");
    require(sent, FAILED_TO_SENT_ETHER);

    // Transfer the ownership of the car to the buyer
    _safeTransfer(_owner, _buyer, _tokenId, "");

    // Reset the car's sold status, buyer, price, and owner
    _car.sold = false;
    _car.buyer = address(0);
    _car.price = 0;
    _car.owner = _buyer;
  }

  /// @notice Get the car data associated with the given token ID
  /// @dev This function is view-only and does not modify the blockchain state
  /// @param _tokenId The ID of the car to retrieve
  /// @return Car The Car associated with the token
  function getCarByToken(uint256 _tokenId) public view returns (Car memory) {
    require(_exists(_tokenId), CAR_DOES_NOT_EXIST);

    return cars[_tokenId];
  }

  /// @notice Return an array of all the cars owned by a given address
  /// @param _owner The address of the owner
  /// @return Car[] A array containing all the cars owned by the given address
  function getCarsByOwner(address _owner) public view returns (Car[] memory) {
    // Get the number of tokens owned by the address
    uint256 tokenCount = balanceOf(_owner);

    // Create a new array to hold the cars with the amount of token
    Car[] memory _cars = new Car[](tokenCount);

    for (uint256 i = 0; i < tokenCount; i++) {
      // Get the tokenID by the owner and index
      uint256 _tokenId = tokenOfOwnerByIndex(_owner, i);
      _cars[i] = cars[_tokenId];
    }

    return _cars;
  }

  /// @notice Returns an array of all the cars in the contract
  /// @return Car[] An array of all the cars in the contract
  function getAllCars() public view returns (Car[] memory) {
    uint256 _tokenCount = totalSupply();
    Car[] memory _cars = new Car[](_tokenCount);

    for (uint256 i = 0; i < _tokenCount; i++) {
      // Get the car at the current index and add it to the array
      _cars[i] = cars[tokenByIndex(i)];
    }

    return _cars;
  }

  /// @notice Allows the owner of a car to change its mileage
  /// @param _tokenId The ID of the car to retrieve
  /// @param _mileage The new mileage of the car
  /// @return The updated Car object
  function changeMileage(uint256 _tokenId, uint256 _mileage) public returns (Car memory) {
    require(_exists(_tokenId), CAR_DOES_NOT_EXIST);
    Car storage _car = cars[_tokenId];
    _car.mileage = _mileage;
    return _car;
  }
}
