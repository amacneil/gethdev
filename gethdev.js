/* global web3 */
(function gethdev() {
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

  /**
   * Start the miner if it is not already running
   */
  function startMiner() {
    if (!web3.eth.mining) {
      log('Starting miner');
      web3.miner.start(THREADS);
    }
  }

  /**
   * Stop the miner if it is running
   */
  function stopMiner() {
    if (web3.eth.mining) {
      log('Stopping miner');
      web3.miner.stop();
    }
  }

  /**
   * Start or stop the miner if necessary
   */
  function checkStatus() {
    // if etherbase balance is too low, start mining
    if (web3.eth.getBalance(web3.eth.coinbase).lessThan(MIN_BALANCE)) {
      startMiner();
      return;
    }

    // if there are any pending transactions, start mining
    if (web3.eth.getBlock('pending').transactions.length > 0) {
      minHeight = web3.eth.blockNumber + CONFIRMATIONS;

      startMiner();
      return;
    }

    if (web3.eth.blockNumber > minHeight) {
      // nothing to do, pause mining for now
      stopMiner();
    }
  }

  // create the first account (with blank password) if necessary
  if (!web3.eth.coinbase) {
    log('Creating etherbase account');
    web3.personal.newAccount('');
  }

  web3.eth.filter('latest', checkStatus);
  web3.eth.filter('pending', checkStatus);
  startMiner();
}());
