import { render, screen } from "@testing-library/react";
import { ThemeSwitcher } from "@/components/ThemeSwitcher";

const mockSetTheme = jest.fn();

jest.mock("next-themes", () => ({
  useTheme: () => ({
    theme: "Quantum Obsidian",
    setTheme: mockSetTheme,
    themes: [
      "Light Mode",
      "Dark Mode",
      "Aethelgard Emerald",
      "Valerius Crimson",
      "Lumina Noir",
      "Oceanic Celestia",
      "Quantum Obsidian",
      "Matrix Onyx",
      "Ivory Classic",
      "Sienna Elegance",
    ],
  }),
}));

describe("ThemeSwitcher", () => {
  it("renders without throwing errors", () => {
    expect(() => render(<ThemeSwitcher />)).not.toThrow();
  });

  it("renders the theme select after mounting", async () => {
    render(<ThemeSwitcher />);

    const select = await screen.findByRole("combobox", {
      name: /select theme/i,
    });

    expect(select).toBeInTheDocument();
    expect(select).toHaveValue("Quantum Obsidian");
  });
});
