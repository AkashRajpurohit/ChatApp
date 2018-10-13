const expect = require("expect");

const { generateMessage } = require("./message");

describe("generateMessage", () => {
  it("should generate new message object", () => {
    const from = "Akash";
    const text = "Hey";

    const message = generateMessage(from, text);

    expect(message.createdAt).toBeA("number");
    expect(message).toInclude({
      from,
      text
    });
  });
});
