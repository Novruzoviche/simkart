/**
 * Utility for formatting Azerbaijan mobile numbers
 * Expected input: 0501234567 or 501234567
 * Output: 0XX XXX XX XX
 */
export function formatPhoneNumber(number: string): string {
  // Remove non-digits
  const clean = number.replace(/\D/g, "");
  
  // Ensure it starts with 0 if it's 9 digits long
  let normalized = clean;
  if (normalized.length === 9) {
    normalized = "0" + normalized;
  }
  
  if (normalized.length !== 10) return normalized;
  
  const prefix = normalized.substring(0, 3);
  const core = normalized.substring(3, 6);
  const mid = normalized.substring(6, 8);
  const end = normalized.substring(8, 10);
  
  return `${prefix} ${core} ${mid} ${end}`;
}

export function generateWhatsAppLink(number: string, price: number): string {
  const formatted = formatPhoneNumber(number);
  const message = `Salam xettim.az, bu nömrə ilə maraqlanıram: ${formatted}. Qiyməti: ${price} AZN.`;
  return `https://wa.me/994${number.startsWith("0") ? number.substring(1) : number}?text=${encodeURIComponent(message)}`;
}

export type NumberCategory = "VİP" | "Qızıl" | "Gümüş" | "Ardıcıl";
export type NumberPrefix = "010" | "050" | "051" | "055" | "070" | "077" | "099";

export interface MobileNumber {
  id: string;
  prefix: string;
  full_number: string;
  price: number;
  category: NumberCategory;
  status: "available" | "sold" | "reserved";
  isVip: boolean;
}

export const SAMPLE_DATA: MobileNumber[] = [
  {
    id: "1",
    prefix: "050",
    full_number: "0507777777",
    price: 15000,
    category: "VİP",
    status: "available",
    isVip: true,
  },
  {
    id: "2",
    prefix: "070",
    full_number: "0702220022",
    price: 2500,
    category: "Qızıl",
    status: "available",
    isVip: false,
  },
  {
    id: "3",
    prefix: "055",
    full_number: "0554445566",
    price: 800,
    category: "Gümüş",
    status: "available",
    isVip: false,
  },
  {
    id: "4",
    prefix: "099",
    full_number: "0991234567",
    price: 1200,
    category: "Ardıcıl",
    status: "available",
    isVip: false,
  },
  {
    id: "5",
    prefix: "010",
    full_number: "0105001010",
    price: 3500,
    category: "VİP",
    status: "available",
    isVip: true,
  },
  {
    id: "6",
    prefix: "077",
    full_number: "0773334455",
    price: 450,
    category: "Gümüş",
    status: "reserved",
    isVip: false,
  }
];
