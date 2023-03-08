// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0 <0.9.0;

import "../node_modules/@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "../node_modules/@openzeppelin/contracts/access/Ownable.sol";
import "../node_modules/@openzeppelin/contracts/utils/Counters.sol";

contract CarDealership is ERC721, Ownable {
  using Counters for Counters.Counter;

  Counters.Counter private _tokenIdCounter;

  constructor() ERC721("CarToken", "CAR") {}

  struct Car {
    address owner;
    string licensePlate;
    uint256 chassisNumber;
    string brand;
    string carType;
    string colour;
    uint256 mileage;
    string imageUrl;
    uint256 price;
    bool forSale;
  }

  mapping(uint256 => Car) private cars;
  uint256 totalCars = 0;

  function safeMint(
    address _owner,
    string memory _licensePlate,
    uint256 _chassisNumber,
    string memory _brand,
    string memory _carType,
    string memory _colour,
    uint256 _mileage,
    string memory _imageUrl
  ) public onlyOwner {
    uint256 tokenId = _tokenIdCounter.current();
    _tokenIdCounter.increment();
    _safeMint(_owner, tokenId);
    cars[tokenId] = Car(
      _owner,
      _licensePlate,
      _chassisNumber,
      _brand,
      _carType,
      _colour,
      _mileage,
      _imageUrl,
      0,
      false
    );
  }

  function sellCar(uint256 _tokenId, uint256 _price) public {
    require(_exists(_tokenId), "CarDealership: car does not exist");
    require(msg.sender == ownerOf(_tokenId), "CarDealership caller is not the owner of the car");

    cars[_tokenId].price = _price;
    cars[_tokenId].forSale = true;

    totalCars += 1;
  }

  function buyCar(uint256 _tokenId) public payable {
    require(_exists(_tokenId), "CarDealership: car does not exist");
    require(cars[_tokenId].forSale == true, "CarDealership: car is not for sale");
    require(msg.value == cars[_tokenId].price, "CarDealership: incorrect payment amount");

    address _seller = ownerOf(_tokenId);
    _transfer(_seller, msg.sender, _tokenId);
    cars[_tokenId].forSale = false;
    cars[_tokenId].owner = msg.sender;
    payable(_seller).transfer(msg.value);
  }

  function getCar(uint256 _tokenId) public view returns (Car memory) {
    require(_exists(_tokenId), "CarDealership: car does not exist");
    return cars[_tokenId];
  }

  function getAllCars() public view returns (Car[] memory) {
    Car[] memory _cars = new Car[](totalCars);

    for (uint256 i = 0; i < totalCars; i++) {
      _cars[i] = cars[i];
    }

    return _cars;
  }
}
