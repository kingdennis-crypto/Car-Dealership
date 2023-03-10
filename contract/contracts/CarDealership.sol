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

  struct Car {
    // The license plate, chassis number, brand, type, and colour of the car
    uint256 tokenId;
    string licensePlate;
    string chassisNumber;
    string brand;
    string carType;
    string colour;
  }

  mapping(uint256 => Car) private cars;

  function mintCar(
    address _owner,
    string memory _licensePlate,
    string memory _chassisNumber,
    string memory _brand,
    string memory _carType,
    string memory _colour
  ) public returns (uint256) {
    _tokenIdCounter.increment();

    uint256 newCarId = _tokenIdCounter.current();
    _safeMint(_owner, newCarId);

    cars[newCarId] = Car(newCarId, _licensePlate, _chassisNumber, _brand, _carType, _colour);

    return newCarId;
  }

  function getCarByToken(uint256 _tokenId) public view returns (Car memory) {
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
}
