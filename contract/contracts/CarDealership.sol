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
    string licensePlate;
    string brand;
  }

  mapping(uint256 => Car) private cars;

  function mintCar(address _owner, string memory _licensePlate, string memory _brand) public returns (uint256) {
    _tokenIdCounter.increment();

    uint256 newCarId = _tokenIdCounter.current();
    _safeMint(_owner, newCarId);

    cars[newCarId] = Car(_licensePlate, _brand);

    return newCarId;
  }

  function getCar(uint256 _tokenId) public view returns (string memory, string memory) {
    require(_exists(_tokenId), "Car does not exist");

    Car memory car = cars[_tokenId];

    return (car.licensePlate, car.brand);
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

  function testFunction() public pure returns (string memory) {
    return "TESTING IF THIS WORKS";
  }
}