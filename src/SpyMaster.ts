import { SmartContract, State, state, Field, method, Proof } from 'o1js';
import { SpyMasterProof } from './zkprogram';

export class SpyMasterContract extends SmartContract {
  @state(Field) highestMessageNumber = State<Field>();

  @method updateHighestMessageNumber(proof: SpyMasterProof) {
    proof.verify();
    this.highestMessageNumber.set(proof.publicOutput);
  }
}
