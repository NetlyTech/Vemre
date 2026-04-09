import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

import numeral from "numeral";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}




export const formatInky = ( amount: string, currency = "$") => {


    let textResult = currency;

    try {
      if (isNaN(parseFloat(amount))) {
        textResult += numeral(parseFloat(amount.replace(",", ""))).format(
          "0,0.00"
        );
      } else {
        textResult += numeral(parseFloat(amount)).format("0,0.00");
      }
    } catch (e) {
    }
    return textResult;
  };