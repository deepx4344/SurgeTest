import { jest, describe, it, expect } from "@jest/globals";

const createTestMock = jest.fn<any>().mockResolvedValue("test-id");
const LoadServiceMock = jest.fn().mockImplementation(() => ({
  createTest: createTestMock,
}));

jest.unstable_mockModule("../../../src/services/loadService.js", () => ({
  default: LoadServiceMock,
}));

const loadController = await import("../../../src/controllers/load.js");

const createRes = () => {
  const res: any = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

const flushPromises = async () =>
  await new Promise((resolve) => setImmediate(resolve));

describe("Load controller", () => {
  it("starts a load test", async () => {
    const req: any = {
      body: {
        url: "https://example.com",
        method: "GET",
        concurrency: 5,
        duration: 10,
      },
    };
    const res = createRes();
    const next = jest.fn();

    loadController.startLoad(req, res, next);
    await flushPromises();

    expect(createTestMock).toHaveBeenCalledWith(req.body);
    expect(res.status).toHaveBeenCalledWith(202);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        success: true,
        message: "Task created successfully",
        data: "test-id",
      }),
    );
  });
});
