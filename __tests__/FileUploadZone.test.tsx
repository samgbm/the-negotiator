import { render, screen } from "@testing-library/react";
import { FileUploadZone } from "@/components/ui/FileUploadZone";

describe("FileUploadZone", () => {
  it("renders correctly", () => {
    expect(() => render(<FileUploadZone />)).not.toThrow();
  });

  it("displays drag and drop instructional text", () => {
    render(<FileUploadZone />);

    expect(
      screen.getByText(/drag and drop your inventory pdf/i),
    ).toBeInTheDocument();
  });
});
