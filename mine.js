/* global web3 */
(function mine() {
  var eth = web3.eth;
  var minHeight = 0;

  // minimum etherbase balance we should mine
  var MIN_BALANCE = web3.toWei(web3.toBigNumber(100), 'ether');

  // number of threads to mine with
  var THREADS = 1;

  // number of blocks to mine on top of new transactions before stopping
  var CONFIRMATIONS = 5;

  function log(str) {
    console.log('[gethdev] ' + str);
  }

  function startMiner() {
    if (!eth.mining) {
      log('miner.start(' + THREADS + ')');
      web3.miner.start(THREADS);
    }
  }

  function stopMiner() {
    if (eth.mining) {
      log('miner.stop()');
      web3.miner.stop();
    }
  }

  function checkStatus() {
    // if coinbase balance is too low, start mining
    if (eth.getBalance(eth.coinbase).lessThan(MIN_BALANCE)) {
      startMiner();
      return;
    }

    // if there are any pending transactions, start mining
    if (eth.getBlock('pending').transactions.length > 0) {
      minHeight = eth.blockNumber + CONFIRMATIONS;

      startMiner();
      return;
    }

    if (eth.blockNumber > minHeight) {
      // nothing to do, pause mining for now
      stopMiner();
    }
  }

  eth.filter('latest', checkStatus);
  eth.filter('pending', checkStatus);
  startMiner();
}());
