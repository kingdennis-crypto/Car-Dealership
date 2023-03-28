// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0 <0.9.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";

import "./CarDealershipStrings.sol";

contract CarDealership is Ownable, ERC721Enumerable {
  using Counters for Counters.Counter;
  Counters.Counter private _tokenIdCounter;

  constructor() ERC721("carTokens", "CAR") {}

  receive() external payable {}

  fallback() external payable {}

  enum Transmission{ AUTOMATIC, HAND_SHIFTED } // Maybe IPFS
  enum GasType{ PETROL, OIL } // Maybe IPFS

  struct Car {
    // The license plate, chassis number, brand, type, and colour of the car
    address owner;
    uint256 tokenId;
    string licensePlate; // Maybe IPFS
    string chassisNumber; // Maybe IPFS
    string brand; // Maybe IPFS
    string carType; // Maybe IPFS
    string colour;
    uint256 mileage;
    bool sold;
    address buyer;
    uint256 price;
    string metadataUri;
    bool forSale;
  }

  struct Mileage {
    uint256 token;
    uint256 mileage;
    uint256 date;
  }

  mapping(uint256 => Car) private cars;
  mapping(uint256 => Mileage[]) private mileageHistory;

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

    cars[newCarId] = Car(_owner, newCarId, _licensePlate, _chassisNumber, _brand, _carType, _colour, _mileage, false, address(0), _price, _metadataUri, true);

    return newCarId;
  }

  /// @notice Allows a user to buy a car with a given token ID.
  /// @param _tokenId the ID of the car being purchased
  /// @dev Requires that the car with the given token exists, is not already sold, and that the buyer is not the owner of the car
  function buyCar(uint256 _tokenId) public payable {
    require(_exists(_tokenId), CarDealershipStrings.CAR_DOES_NOT_EXIST);
    Car storage _car = cars[_tokenId];

    require(ownerOf(_tokenId) != msg.sender, CarDealershipStrings.CANT_BUY_OWN_CAR);
    require(!_car.sold, CarDealershipStrings.CAR_ALREADY_SOLD);
    require(msg.value >= _car.price, CarDealershipStrings.INSUFFICIENT_FUNDS);

    _car.sold = true;
    _car.buyer = msg.sender;
    // TODO: Change so that the money will be set on the contract as a broker

    emit CarSold(_tokenId, msg.sender, msg.value);
  }

  /// @notice Allows the buyer to cancel an order and get the money back
  /// @param _tokenId the ID of the car being purchased
  function cancelCarOrder(uint256 _tokenId) public {
  // TODO: After cancelation check what happens with the money
    require(_exists(_tokenId), CarDealershipStrings.CAR_DOES_NOT_EXIST);
    Car storage _car = cars[_tokenId];
    require(_car.sold, CarDealershipStrings.CAR_NOT_SOLD);
    require(msg.sender == _car.buyer, CarDealershipStrings.ONLY_BUYER_CANCEL);

    // Transfer the money back to the buyer
    (bool _sent, ) = payable(_car.buyer).call{value: _car.price * 1 ether}("");
    require(_sent, CarDealershipStrings.FAILED_TO_SENT_ETHER);

    // Reset the car's sold status, buyer, price, and owner
    _car.sold = false;
    _car.buyer = address(0);
  }

  /// @notice Allows the buyer to retrieve the purchased car.
  /// @param _tokenId The ID of the car to retrieve
  function retrieveCar(uint256 _tokenId) public payable {
    // Check if the car exists
    require(_exists(_tokenId), CarDealershipStrings.CAR_DOES_NOT_EXIST);
    // Retrieve the car and check the sold status and the buyer
    Car storage _car = cars[_tokenId];
    require(_car.sold, CarDealershipStrings.CAR_NOT_SOLD);
    require(msg.sender == _car.buyer, CarDealershipStrings.ONLY_BUYER);

    // Get the price of the car in WEI
    // Transfer the price of the car to the original owner
    (bool sent, ) = payable(ownerOf(_tokenId)).call{value: _car.price * 1 ether}("");
    require(sent, CarDealershipStrings.FAILED_TO_SENT_ETHER);

    // Transfer the ownership of the car to the buyer
    _safeTransfer(ownerOf(_tokenId), _car.buyer, _tokenId, "");

    // Reset the car's sold status, buyer, price, and owner
    _car.sold = false;
    _car.buyer = address(0);
    _car.owner = msg.sender;
    _car.forSale = false;
  }

  /// @notice Get the car data associated with the given token ID
  /// @dev This function is view-only and does not modify the blockchain state
  /// @param _tokenId The ID of the car to retrieve
  /// @return Car The Car associated with the token
  function getCarByToken(uint256 _tokenId) public view returns (Car memory) {
    require(_exists(_tokenId), CarDealershipStrings.CAR_DOES_NOT_EXIST);

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

  function addMileageReport(uint256 _token, uint256 _mileageNumber, uint256 _time) external {
    require(_mileageNumber > cars[_token].mileage, "You need a higher mileage number!");
    mileageHistory[_token].push(Mileage(_token, _mileageNumber, _time));
    cars[_token].mileage = _mileageNumber;
  }

  function getCarMileageHistory(uint256 _token) external view returns (Mileage[] memory) {
    return mileageHistory[_token];
  }

  function changeCarPrice(uint256 _token, uint256 _price) public {
    cars[_token].price = _price;
  }

  function changeCarAvailability(uint256 _token, bool _availability) external {
    cars[_token].forSale = _availability;
  }

  // TODO: Add function to add dealership and add modifier to check if wallet is dealership
}
