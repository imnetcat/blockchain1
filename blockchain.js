import { createHash } from 'crypto';
import PoWConsensus from './consensus/pow.js';

class Blockchain {
    constructor() {
        this.chain = [];
        this.transactions = [];
        // Generate genesis block - the first block of the chain
        this.newBlock('05102001', 'Guskov');
    }

    // Add new block to the chain
    newBlock(proof, parentHash) {
        const parentBlock = this.getLastBlock();
        const parentIndex = parentBlock?.index;
        const block = {
            index: parentBlock ? parentIndex + 1 : 0,
            timestamp: new Date().getTime(),
            transactions: this.transactions,
            proof,
            parentHash: parentHash || this.hash(parentBlock),
        };
        // Add blcok to the chain
        this.chain.push(block);
        // clear transiction queue
        this.transactions = [];
        return block;
    }

    // Add new transaction to the queue
    newTransaction(sender, recipient, amount) {
        // Add transaction to the queue
        this.transactions.push({
            sender,
            recipient,
            amount
        });

        // Return next chain block index
        return this.chain.length;
    }

    // Generate hash from provided block
    hash(block) {
        return createHash('sha256').update(JSON.stringify(block)).digest('hex');
    }

    getLastBlock() {
        if (this.chain.length === 0) return undefined;
        return this.chain[this.chain.length - 1];
    }

    pow() {
        const consensus = new PoWConsensus().find();
        this.newBlock(consensus.proof);
    }
}

export default Blockchain;
