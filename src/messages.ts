import { Field, Struct } from 'o1js';

export class Message extends Struct({
  messageNumber: Field,
  agentId: Field,
  agentXLoc: Field,
  agentYLoc: Field,
  checkSum: Field
}) {
  constructor(messageNumber: Field, agentId: Field, agentXLoc: Field, agentYLoc: Field, checkSum: Field) {
    super({ messageNumber, agentId, agentXLoc, agentYLoc, checkSum });
  }
  
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
    return this.checkSum.equals(this.agentId.add(this.agentXLoc).add(this.agentYLoc));
  }
  // Is the agentXLoc between 0 and 15000?
  isAgentXLocInRange() {
    return this.agentXLoc.lessThanOrEqual(Field(15000));
  }
  // Is the agentYLoc between 5000 and 20000?
  isAgentYLocInRange() {
    return this.agentYLoc.lessThanOrEqual(Field(20000)).and(this.agentYLoc.greaterThanOrEqual(Field(5000)));
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