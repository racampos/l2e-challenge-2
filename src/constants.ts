import { Message } from './zkprogram';
import { Field } from 'o1js';

export const testMessages: [boolean, Message][][] = [
  // Test 1: Valid Message Processing
  [
    [
      true,
      new Message({
        messageNumber: Field(1),
        agentId: Field(100),
        agentXLoc: Field(1000),
        agentYLoc: Field(10000),
        checkSum: Field(100).add(Field(1000)).add(Field(10000)),
      }),
    ],
    [
      true,
      new Message({
        messageNumber: Field(2),
        agentId: Field(101),
        agentXLoc: Field(2000),
        agentYLoc: Field(11000),
        checkSum: Field(101).add(Field(2000)).add(Field(11000)),
      }),
    ],
    [
      true,
      new Message({
        messageNumber: Field(3),
        agentId: Field(102),
        agentXLoc: Field(3000),
        agentYLoc: Field(12000),
        checkSum: Field(102).add(Field(3000)).add(Field(12000)),
      }),
    ],
  ],
  // Test 2: Invalid Checksum
  [
    [
      false,
      new Message({
        messageNumber: Field(1),
        agentId: Field(100),
        agentXLoc: Field(1000),
        agentYLoc: Field(10000),
        checkSum: Field(100).add(Field(1000)).add(Field(10001)), // Incorrect checksum
      }),
    ],
  ],
  // Test 3: Out of Range Agent ID
  [
    [
      false,
      new Message({
        messageNumber: Field(1),
        agentId: Field(3001), // Out of range
        agentXLoc: Field(1000),
        agentYLoc: Field(10000),
        checkSum: Field(3001).add(Field(1000)).add(Field(10000)),
      }),
    ],
  ],
  // Test 4: Out of Range Agent XLocation
  [
    [
      false,
      new Message({
        messageNumber: Field(1),
        agentId: Field(100),
        agentXLoc: Field(15001), // Out of range
        agentYLoc: Field(10000),
        checkSum: Field(100).add(Field(15001)).add(Field(10000)),
      }),
    ],
  ],
  // Test 5: Out of Range Agent YLocation
  [
    [
      false,
      new Message({
        messageNumber: Field(1),
        agentId: Field(100),
        agentXLoc: Field(1000),
        agentYLoc: Field(20001), // Out of range
        checkSum: Field(100).add(Field(1000)).add(Field(20001)),
      }),
    ],
  ],
  // Test 6: Agent YLocation Less Than Agent XLocation
  [
    [
      false,
      new Message({
        messageNumber: Field(1),
        agentId: Field(100),
        agentXLoc: Field(10000), // XLocation > YLocation
        agentYLoc: Field(1000),
        checkSum: Field(100).add(Field(10000)).add(Field(1000)),
      }),
    ],
  ],
  // Test 7: Agent ID Zero
  [
    [
      true,
      new Message({
        messageNumber: Field(1),
        agentId: Field(0), // Agent ID is zero
        agentXLoc: Field(1000),
        agentYLoc: Field(10000),
        checkSum: Field(0).add(Field(1000)).add(Field(10000)),
      }),
    ],
  ],
  // Test 8: Duplicate Message Number
  [
    [
      true,
      new Message({
        messageNumber: Field(1),
        agentId: Field(100),
        agentXLoc: Field(1000),
        agentYLoc: Field(10000),
        checkSum: Field(100).add(Field(1000)).add(Field(10000)),
      }),
    ],
    [
      true,
      new Message({
        messageNumber: Field(1), // Duplicate message number
        agentId: Field(101),
        agentXLoc: Field(2000),
        agentYLoc: Field(11000),
        checkSum: Field(101).add(Field(2000)).add(Field(11000)),
      }),
    ],
  ],
  // Test 9: Empty Batch
  [],
  // Test 10: Batch with All Invalid Messages
  [
    [
      false,
      new Message({
        messageNumber: Field(1),
        agentId: Field(3001), // Out of range
        agentXLoc: Field(1000),
        agentYLoc: Field(10000),
        checkSum: Field(3001).add(Field(1000)).add(Field(10000)),
      }),
    ],
    [
      false,
      new Message({
        messageNumber: Field(2),
        agentId: Field(100),
        agentXLoc: Field(15001), // Out of range
        agentYLoc: Field(10000),
        checkSum: Field(100).add(Field(15001)).add(Field(10000)),
      }),
    ],
    [
      false,
      new Message({
        messageNumber: Field(3),
        agentId: Field(100),
        agentXLoc: Field(10000), // XLocation > YLocation
        agentYLoc: Field(5000),
        checkSum: Field(100).add(Field(10000)).add(Field(1000)),
      }),
    ],
    [
      false,
      new Message({
        messageNumber: Field(4),
        agentId: Field(100),
        agentXLoc: Field(1000),
        agentYLoc: Field(20001), // Out of range
        checkSum: Field(100).add(Field(1000)).add(Field(20001)),
      }),
    ],
  ],
  // Test 11: Batch with Mixed Valid and Invalid Messages
  [
    [
      true,
      new Message({
        messageNumber: Field(1),
        agentId: Field(100),
        agentXLoc: Field(1000),
        agentYLoc: Field(10000),
        checkSum: Field(100).add(Field(1000)).add(Field(10000)),
      }),
    ],
    [
      false,
      new Message({
        messageNumber: Field(2),
        agentId: Field(3001), // Out of range
        agentXLoc: Field(1000),
        agentYLoc: Field(10000),
        checkSum: Field(3001).add(Field(1000)).add(Field(10000)),
      }),
    ],
    [
      true,
      new Message({
        messageNumber: Field(3),
        agentId: Field(101),
        agentXLoc: Field(2000),
        agentYLoc: Field(11000),
        checkSum: Field(101).add(Field(2000)).add(Field(11000)),
      }),
    ],
    [
      false,
      new Message({
        messageNumber: Field(4),
        agentId: Field(100),
        agentXLoc: Field(10000), // XLocation > YLocation
        agentYLoc: Field(1000),
        checkSum: Field(100).add(Field(10000)).add(Field(1000)),
      }),
    ],
  ],
  // Test 13: Large Batch Processing
  [
    // Include 200 valid messages
  ],
  // Test 14: Circuit Size
  [
    // Include a large batch of valid messages to test circuit size
  ],
];

// const testMessages2: [boolean, Message][][] = [
//   [
//     [
//       true,
//       new Message({
//         messageNumber: Field(1),
//         agentId: Field(100),
//         agentXLoc: Field(1000),
//         agentYLoc: Field(10000),
//         checkSum: Field(100).add(Field(1000)).add(Field(10001)), // Incorrect checksum
//       }),
//     ],
//   ],
// ];

// for ( let curTestMessages of testMessages2) {
//   for (let [valid, message] of curTestMessages) {
//     valid ? console.log('Valid') : console.log('Invalid');
//     console.log(message);
//   }
// }
