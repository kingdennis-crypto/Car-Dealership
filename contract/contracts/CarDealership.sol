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

  struct Car {
    // The license plate, chassis number, brand, type, and colour of the car
    address owner;
    uint256 tokenId;
    string licensePlate;
    string chassisNumber;
    string brand;
    string carType;
    string colour;
    bool sold;
    address buyer;
    uint256 price;
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
    uint256 _price
  ) public returns (uint256) {
    _tokenIdCounter.increment();

    uint256 newCarId = _tokenIdCounter.current();
    _safeMint(_owner, newCarId);

    cars[newCarId] = Car(_owner, newCarId, _licensePlate, _chassisNumber, _brand, _carType, _colour, false, address(0), _price);

    return newCarId;
  }

  function buyCar(uint256 _tokenId) public payable {
    require(_exists(_tokenId), "Car does not exist");
    Car storage _car = cars[_tokenId];

    address _owner = ownerOf(_tokenId);
    require(_owner != msg.sender, "You can't buy your own car");
    require(!_car.sold, "Car is already sold");
    require(msg.value >= _car.price, "Insufficient funds");

    _car.sold = true;
    _car.buyer = msg.sender;
    // TODO: Change so that the money will be set on the contract as a broker

    emit CarSold(_tokenId, msg.sender, msg.value);
  }

  function retrieveCar(uint256 _tokenId) public payable {
    require(_exists(_tokenId), "Car does not exist");
    Car storage _car = cars[_tokenId];
    require(_car.sold, "Car is not sold");
    require(msg.sender == _car.buyer, "Only the buyer can retrieve the car");

    address _owner = ownerOf(_tokenId);
    address _buyer = _car.buyer;

    uint256 _price = _car.price * 1 ether;

    // Transfer the price of the car to the original owner
    (bool sent, ) = payable(_owner).call{value: _price}("");

    require(sent, "Failed to send Ether");

    // Transfer the ownership of the car to the buyer
    _safeTransfer(_owner, _buyer, _tokenId, "");

    _car.sold = false;
    _car.buyer = address(0);
    _car.price = 0;
    _car.owner = _buyer;
  }

  function getCarByToken(uint256 _tokenId) public view returns (Car memory) {
    require(_exists(_tokenId), "Car does not exist");

    return cars[_tokenId];
  }

  function getCarsByOwner(address _owner) public view returns (Car[] memory) {
    uint256 tokenCount = balanceOf(_owner);
    Car[] memory _cars = new Car[](tokenCount);

    for (uint256 i = 0; i < tokenCount; i++) {
      uint256 _tokenId = tokenOfOwnerByIndex(_owner, i);
      _cars[i] = cars[_tokenId];
    }

    return _cars;
  }

  function getAllCars() public view returns (Car[] memory) {
    uint256 _tokenCount = totalSupply();
    Car[] memory _cars = new Car[](_tokenCount);

    for (uint256 i = 0; i < _tokenCount; i++) {
      _cars[i] = cars[tokenByIndex(i)];
    }

    return _cars;
  }
}
