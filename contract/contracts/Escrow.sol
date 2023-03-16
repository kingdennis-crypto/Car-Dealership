// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0 <0.9.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Burnable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract Escrow is ERC721, ERC721Burnable, Ownable {
  using Counters for Counters.Counter;

  Counters.Counter private _tokenIdCounter;

  constructor() ERC721("Escrow", "ESC") {}

  struct Transaction {
    address seller;
    address buyer;
    uint256 carId;
    uint256 price;
    uint256 startTime;
    bool isCompleted;
  }

  mapping(uint256 => Transaction) private transactions;

  event OrderCreated( uint256 indexed orderId, address indexed seller, address indexed buyer, uint256 carId, uint256 price);
  event OrderPaid(uint256 indexed orderId, address indexed buyer, uint256 amount);
  event OrderCancelled(uint256 indexed orderId, address indexed buyer);

  function safeMint(address to) public {
    uint256 tokenId = _tokenIdCounter.current();
    _tokenIdCounter.increment();
    _safeMint(to, tokenId);
  }

  function completeTransaction(uint256 _token) public {
    Transaction storage _escrow = transactions[_token];

    require(_escrow.buyer == msg.sender, "Only the buyer can complete the transaction");
    require(!_escrow.isCompleted, "Transaction is already completed");
    require(block.timestamp >= _escrow.startTime + 1 days, "Cannot complete transaction before 1 day");

    _escrow.isCompleted = true;

    payable(_escrow.seller).transfer(_escrow.price);

    safeTransferFrom(ownerOf(_token), _escrow.buyer, _token);
  }
}
