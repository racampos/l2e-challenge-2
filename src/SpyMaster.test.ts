import {
  Mina,
  PrivateKey,
  PublicKey,
  AccountUpdate,
  Field,
  Cache,
  Proof,
  Bool,
} from 'o1js';
import { SpyMasterZKProgram, Message, SpyMasterProof } from './zkprogram';
import { SpyMasterContract } from './SpyMaster';

import { testMessages } from './constants';

describe('SpyMaster', () => {
  let count = 0;
  let highestMessageNumber: Field;
  let cache: Cache;
  let baseProof: Proof<undefined, Field>;
  const dummyMessage = new Message({
    messageNumber: Field(0),
    agentId: Field(0),
    agentXLoc: Field(0),
    agentYLoc: Field(0),
    checkSum: Field(0),
  });

  beforeAll(async () => {
    cache = Cache.FileSystem('./cacheProof');
    await SpyMasterZKProgram.compile({ cache });

    let dummyProof = await SpyMasterProof.dummy(undefined, Field(0), 1);
    baseProof = await SpyMasterZKProgram.checkMessageDetails(
      dummyMessage,
      dummyProof,
      Bool(false)
    );
  });

  describe('ZkProgram - Basic Functionality Tests', () => {
    let messages: [boolean, Message][];

    beforeEach(() => {
      console.log(`Test ${count + 1}`);
      messages = testMessages[count];
      count++;
    });

    it('1. Should process a batch of valid messages', async () => {
      let nextProof = baseProof;
      let lastValidProof = baseProof;

      for (const [valid, message] of messages) {
        nextProof = await SpyMasterZKProgram.checkMessageDetails(
          message,
          nextProof,
          Bool(true)
        );

        if (valid) {
          expect(nextProof.publicOutput).toStrictEqual(message.messageNumber);
          lastValidProof = nextProof;
        } else {
          expect(nextProof.publicOutput).toStrictEqual(
            lastValidProof.publicOutput
          );
        }
      }
      highestMessageNumber = lastValidProof.publicOutput;
      expect(highestMessageNumber).toStrictEqual(Field(messages.length));
    });

    it('2. Should not process a message with an incorrect checksum', async () => {
      let nextProof = baseProof;
      let lastValidProof = baseProof;
      const expectedHighestNumber = Field(0);

      for (const [valid, message] of messages) {
        nextProof = await SpyMasterZKProgram.checkMessageDetails(
          message,
          nextProof,
          Bool(true)
        );

        if (valid) {
          expect(nextProof.publicOutput).toStrictEqual(message.messageNumber);
          lastValidProof = nextProof;
        } else {
          expect(nextProof.publicOutput).toStrictEqual(
            lastValidProof.publicOutput
          );
        }
      }

      expect(lastValidProof.publicOutput).toStrictEqual(expectedHighestNumber);
    });

    it('3. Should not process a message with an Agent ID outside of range', async () => {
      let nextProof = baseProof;
      let lastValidProof = baseProof;
      const expectedHighestNumber = Field(0);

      for (const [valid, message] of messages) {
        nextProof = await SpyMasterZKProgram.checkMessageDetails(
          message,
          nextProof,
          Bool(true)
        );

        if (valid) {
          expect(nextProof.publicOutput).toStrictEqual(message.messageNumber);
          lastValidProof = nextProof;
        } else {
          expect(nextProof.publicOutput).toStrictEqual(
            lastValidProof.publicOutput
          );
        }
      }

      expect(lastValidProof.publicOutput).toStrictEqual(expectedHighestNumber);
    });

    it('4. Should not process a message with an Agent X Location outside of range', async () => {
      let nextProof = baseProof;
      let lastValidProof = baseProof;
      const expectedHighestNumber = Field(0);

      for (const [valid, message] of messages) {
        nextProof = await SpyMasterZKProgram.checkMessageDetails(
          message,
          nextProof,
          Bool(true)
        );

        if (valid) {
          expect(nextProof.publicOutput).toStrictEqual(message.messageNumber);
          lastValidProof = nextProof;
        } else {
          expect(nextProof.publicOutput).toStrictEqual(
            lastValidProof.publicOutput
          );
        }
      }

      expect(lastValidProof.publicOutput).toStrictEqual(expectedHighestNumber);
    });

    it('5. Should not process a message with an Agent Y Location outside of range', async () => {
      let nextProof = baseProof;
      let lastValidProof = baseProof;
      const expectedHighestNumber = Field(0);

      for (const [valid, message] of messages) {
        nextProof = await SpyMasterZKProgram.checkMessageDetails(
          message,
          nextProof,
          Bool(true)
        );

        if (valid) {
          expect(nextProof.publicOutput).toStrictEqual(message.messageNumber);
          lastValidProof = nextProof;
        } else {
          expect(nextProof.publicOutput).toStrictEqual(
            lastValidProof.publicOutput
          );
        }
      }

      expect(lastValidProof.publicOutput).toStrictEqual(expectedHighestNumber);
    });

    it('6. Should not process a message with Agent YLocation less than XLocation gets dropped', async () => {
      let nextProof = baseProof;
      let lastValidProof = baseProof;
      const expectedHighestNumber = Field(0);

      for (const [valid, message] of messages) {
        nextProof = await SpyMasterZKProgram.checkMessageDetails(
          message,
          nextProof,
          Bool(true)
        );

        if (valid) {
          expect(nextProof.publicOutput).toStrictEqual(message.messageNumber);
          lastValidProof = nextProof;
        } else {
          expect(nextProof.publicOutput).toStrictEqual(
            lastValidProof.publicOutput
          );
        }
      }

      expect(lastValidProof.publicOutput).toStrictEqual(expectedHighestNumber);
    });

    it('7. Should process a message when the agent ID is 0 as valid', async () => {
      let nextProof = baseProof;
      let lastValidProof = baseProof;
      const expectedHighestNumber = Field(1);

      for (const [valid, message] of messages) {
        nextProof = await SpyMasterZKProgram.checkMessageDetails(
          message,
          nextProof,
          Bool(true)
        );

        if (valid) {
          expect(nextProof.publicOutput).toStrictEqual(message.messageNumber);
          lastValidProof = nextProof;
        } else {
          expect(nextProof.publicOutput).toStrictEqual(
            lastValidProof.publicOutput
          );
        }
      }

      expect(lastValidProof.publicOutput).toStrictEqual(expectedHighestNumber);
    });

    it('8. Should ensure a duplicate message number is processed but its details are not checked', async () => {
      let nextProof = baseProof;
      let lastValidProof = baseProof;
      const expectedHighestNumber = Field(1);

      for (const [valid, message] of messages) {
        nextProof = await SpyMasterZKProgram.checkMessageDetails(
          message,
          nextProof,
          Bool(true)
        );

        if (valid) {
          expect(nextProof.publicOutput).toStrictEqual(message.messageNumber);
          lastValidProof = nextProof;
        } else {
          expect(nextProof.publicOutput).toStrictEqual(
            lastValidProof.publicOutput
          );
        }
      }

      expect(lastValidProof.publicOutput).toStrictEqual(expectedHighestNumber);
    });
  });

  describe('ZkProgram - Edge Cases', () => {
    let messages: [boolean, Message][];

    beforeEach(() => {
      console.log(`Test ${count + 1}`);
      messages = testMessages[count];
      count++;
    });

    it('9. Verify that processing an empty batch does not cause errors', async () => {
      let nextProof = baseProof;
      let lastValidProof = baseProof;
      const expectedHighestNumber = Field(0);
      console.log('Test 9:', messages);
      for (const [valid, message] of messages) {
        nextProof = await SpyMasterZKProgram.checkMessageDetails(
          message,
          nextProof,
          Bool(true)
        );

        if (valid) {
          expect(nextProof.publicOutput).toStrictEqual(message.messageNumber);
          lastValidProof = nextProof;
        } else {
          expect(nextProof.publicOutput).toStrictEqual(
            lastValidProof.publicOutput
          );
        }
      }

      expect(lastValidProof.publicOutput).toStrictEqual(expectedHighestNumber);
    });

    it('10. Batch with All Invalid Messages', async () => {
      let nextProof = baseProof;
      let lastValidProof = baseProof;

      const expectedHighestNumber = Field(0);

      for (const [valid, message] of messages) {
        nextProof = await SpyMasterZKProgram.checkMessageDetails(
          message,
          nextProof,
          Bool(true)
        );

        if (valid) {
          expect(nextProof.publicOutput).toStrictEqual(message.messageNumber);
          lastValidProof = nextProof;
        } else {
          expect(nextProof.publicOutput).toStrictEqual(
            lastValidProof.publicOutput
          );
        }
      }

      expect(lastValidProof.publicOutput).toStrictEqual(expectedHighestNumber);
    });

    it('11. Batch with Mixed Valid and Invalid Messages', async () => {
      let nextProof = baseProof;
      let lastValidProof = baseProof;

      const expectedHighestNumber = Field(3);
      for (const [valid, message] of messages) {
        nextProof = await SpyMasterZKProgram.checkMessageDetails(
          message,
          nextProof,
          Bool(true)
        );

        if (valid) {
          expect(nextProof.publicOutput).toStrictEqual(message.messageNumber);
          lastValidProof = nextProof;
        } else {
          expect(nextProof.publicOutput).toStrictEqual(
            lastValidProof.publicOutput
          );
        }
      }
      expect(lastValidProof.publicOutput).toStrictEqual(expectedHighestNumber);
    });
  });

  describe('Smart Contract', () => {
    let zkApp: SpyMasterContract,
      zkAppAddress: PublicKey,
      zkAppPrivKey: PrivateKey,
      deployerAcc: PublicKey,
      deployerAccPrivKey: PrivateKey;

    async function localDeploy() {
      const txn = await Mina.transaction(deployerAcc, () => {
        AccountUpdate.fundNewAccount(deployerAcc);
        zkApp.deploy({ zkappKey: zkAppPrivKey });
      });
      const txId = await txn.sign([deployerAccPrivKey, zkAppPrivKey]).send();
      await txId.wait();
    }

    beforeEach(() => {
      zkAppPrivKey = PrivateKey.random();
      zkAppAddress = zkAppPrivKey.toPublicKey();
      zkApp = new SpyMasterContract(zkAppAddress);
      const localBlockchain = Mina.LocalBlockchain({ proofsEnabled: false });
      Mina.setActiveInstance(localBlockchain);
      ({ privateKey: deployerAccPrivKey, publicKey: deployerAcc } =
        localBlockchain.testAccounts[0]);
    });

    it('12. Should update the highest message number in the Smart Contract', async () => {
      await SpyMasterContract.compile();
      await localDeploy();

      const [, message] = testMessages[0][0];
      const proof = await SpyMasterZKProgram.checkMessageDetails(
        message,
        baseProof,
        Bool(true)
      );

      const tx = await Mina.transaction(deployerAcc, () => {
        zkApp.updateHighestMessageNumber(proof);
      });
      await tx.prove();
      await tx.sign([deployerAccPrivKey]).send();

      const highestNumber = zkApp.highestMessageNumber.get();
      expect(highestNumber).toStrictEqual(message.messageNumber);
    });

    it('13. Should throw error due to invalid proof', async () => {
      await SpyMasterContract.compile();
      await localDeploy();

      let invalidDummyProof = await SpyMasterProof.dummy(
        undefined,
        Field(0),
        1
      );

      expect(async () => {
        const tx = await Mina.transaction(deployerAcc, () => {
          zkApp.updateHighestMessageNumber(invalidDummyProof);
        });
        await tx.prove();
        await tx.sign([deployerAccPrivKey]).send();
      }).rejects.toThrow();
    });

    it('14. Proof is valid, but should not update highest value', async () => {
      await SpyMasterContract.compile();
      await localDeploy();

      const expectedHighestNumber = Field(0);

      // Invalid Message
      const [, message] = testMessages[1][0];
      const proof = await SpyMasterZKProgram.checkMessageDetails(
        message,
        baseProof,
        Bool(true)
      );
      const tx = await Mina.transaction(deployerAcc, () => {
        zkApp.updateHighestMessageNumber(proof);
      });
      await tx.prove();
      await tx.sign([deployerAccPrivKey]).send();

      const contractHighestNum = zkApp.highestMessageNumber.get();

      expect(contractHighestNum).toStrictEqual(expectedHighestNumber);
    });

    it('15. All messages valid, should update highest value on chain to 3', async () => {
      await SpyMasterContract.compile();
      await localDeploy();

      const validMessages = testMessages[0];
      let nextProof = baseProof;

      const expectedHighestNumber = Field(3);

      for (const [, message] of validMessages) {
        nextProof = await SpyMasterZKProgram.checkMessageDetails(
          message,
          nextProof,
          Bool(true)
        );
      }

      const tx = await Mina.transaction(deployerAcc, () => {
        zkApp.updateHighestMessageNumber(nextProof);
      });
      await tx.prove();
      await tx.sign([deployerAccPrivKey]).send();

      const contractHighestNum = zkApp.highestMessageNumber.get();

      expect(contractHighestNum).toStrictEqual(expectedHighestNumber);
    });
  });
});
