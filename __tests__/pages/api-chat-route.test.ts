import { createMocks } from "node-mocks-http";
import handler from "@/app/api/chat/route";

describe("/api/chat", () => {
  it("returns 400 if no message is provided", async () => {
    const { req, res } = createMocks({
      method: "POST",
      body: {},
    });

    await handler(req, res);
    expect(res._getStatusCode()).toBe(400);
  });

  it("returns 200 with a mock AI reply", async () => {
    const { req, res } = createMocks({
      method: "POST",
      body: { message: "hello" },
    });

    await handler(req, res);
    const data = JSON.parse(res._getData());
    expect(res._getStatusCode()).toBe(200);
    expect(data.reply).toBeDefined();
  });
});
