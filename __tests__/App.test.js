import { render } from "@testing-library/react-native";

import App from "../App";

describe("App", () => {
  it("renders app title", () => {
    const { getByText } = render(<App />);
    expect(getByText("sudo9")).toBeTruthy();
  });
});

