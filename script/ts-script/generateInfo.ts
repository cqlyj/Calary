import { hashEndpointWithScope } from "@selfxyz/core";
import { getPackedForbiddenCountries } from "@selfxyz/core";

const endpoint = "https://27ad-111-235-226-130.ngrok-free.app";
const scopeString = "Calary-Payroll";

const scope = hashEndpointWithScope(endpoint, scopeString);
console.log("Generated scope:", scope);

const forbiddenCountries = ["IRN", "PRK"];
const packedForbiddenCountries =
  getPackedForbiddenCountries(forbiddenCountries);
console.log("Packed forbidden countries:", packedForbiddenCountries);
