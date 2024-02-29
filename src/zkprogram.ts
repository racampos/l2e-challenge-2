import { SelfProof, Field, ZkProgram, Provable, Bool, Struct } from 'o1js';

export class Message extends Struct({
  messageNumber: Field,
  agentId: Field,
  agentXLoc: Field,
  agentYLoc: Field,
  checkSum: Field,
}) {
  // Is agentId equal to zero?
  isAgentIdZero() {
    return this.agentId.equals(Field(0));
  }
  // Is agentId between 0 and 3000?
  isAgentIdInRange() {
    return this.agentId.lessThanOrEqual(Field(3000));
  }
  // Is the checkSum equal to the sum of Agent ID, Agent XLocation, and Agent YLocation?
  isCheckSumCorrect() {
    return this.checkSum.equals(
      this.agentId.add(this.agentXLoc).add(this.agentYLoc)
    );
  }
  // Is the agentXLoc between 0 and 15000?
  isAgentXLocInRange() {
    return this.agentXLoc.lessThanOrEqual(Field(15000));
  }
  // Is the agentYLoc between 5000 and 20000?
  isAgentYLocInRange() {
    return this.agentYLoc
      .lessThanOrEqual(Field(20000))
      .and(this.agentYLoc.greaterThanOrEqual(Field(5000)));
  }
  // Is the agentYLoc greater than agentXLoc?
  isAgentYLocGreaterThanAgentXLoc() {
    return this.agentYLoc.greaterThan(this.agentXLoc);
  }
  // Check if the message is a duplicate (i.e. the message number is not greater than the previous message number)
  messageIsDuplicate(previousMessageNumber: Field) {
    return this.messageNumber.lessThanOrEqual(previousMessageNumber);
  }
}

export const SpyMasterZKProgram = ZkProgram({
  name: 'process-messages',
  publicOutput: Field, // highest message number

  methods: {
    checkMessageDetails: {
      privateInputs: [Message, SelfProof, Bool],

      method(
        message: Message,
        previousProof: SelfProof<void, Field>,
        isRecursive: Bool
      ): Field {
        // Verify the previous proof
        previousProof.verifyIf(isRecursive);
        const previousHighestMessageNumber = previousProof.publicOutput;

        // Message is valid if agentId is zero or if the message is a duplicate or if all the rest of the checks are true
        const messageIsValid = Bool.or(
          message.isAgentIdZero(),
          Bool.or(
            message.messageIsDuplicate(previousProof.publicOutput),
            Bool.and(
              message.isAgentIdInRange(),
              Bool.and(
                message.isCheckSumCorrect(),
                Bool.and(
                  message.isAgentXLocInRange(),
                  Bool.and(
                    message.isAgentYLocInRange(),
                    message.isAgentYLocGreaterThanAgentXLoc()
                  )
                )
              )
            )
          )
        );
        // If the current message is valid, the new highest message number is this message's number
        // If the current message is not valid, we ignore it and keep the previous highest message number
        const newHighestMessageNumber = Provable.if(
          messageIsValid,
          message.messageNumber,
          previousHighestMessageNumber
        );

        return newHighestMessageNumber;
      },
    },
  },
});

export class SpyMasterProof extends ZkProgram.Proof(SpyMasterZKProgram) {}
