// f713925394e00840af3b
//
// API Secret
// 818a3f339b8c1a42cb2950e2682b66a64648566a2c6283edf957d64438638172
//
// JWT
// (Secret access token)
// eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySW5mb3JtYXRpb24iOnsiaWQiOiI2OTY5YjNhZS1hZmQ2LTRjOGItODEwYS0zM2FkOGZhY2NjNzkiLCJlbWFpbCI6InJhaHVsdHJpcGF0aGlkZXZAZ21haWwuY29tIiwiZW1haWxfdmVyaWZpZWQiOnRydWUsInBpbl9wb2xpY3kiOnsicmVnaW9ucyI6W3siaWQiOiJGUkExIiwiZGVzaXJlZFJlcGxpY2F0aW9uQ291bnQiOjF9XSwidmVyc2lvbiI6MX0sIm1mYV9lbmFibGVkIjpmYWxzZX0sImF1dGhlbnRpY2F0aW9uVHlwZSI6InNjb3BlZEtleSIsInNjb3BlZEtleUtleSI6ImY3MTM5MjUzOTRlMDA4NDBhZjNiIiwic2NvcGVkS2V5U2VjcmV0IjoiODE4YTNmMzM5YjhjMWE0MmNiMjk1MGUyNjgyYjY2YTY0NjQ4NTY2YTJjNjI4M2VkZjk1N2Q2NDQzODYzODE3MiIsImlhdCI6MTY0MjI4NDIzNn0.5q43YwXrDbLmhsoc4qzTomp4MhJJtf3hs0IxxBPzKRU


const axios = require('axios');

export const pinJSONToIPFS = (JSONBody: Object): Promise<string> => {
    const url = `https://api.pinata.cloud/pinning/pinJSONToIPFS`;
    return axios
        .post(url, JSONBody, {
            headers: {
                pinata_api_key: "f713925394e00840af3b",
                pinata_secret_api_key: "818a3f339b8c1a42cb2950e2682b66a64648566a2c6283edf957d64438638172"
            }
        })
        .then((resp: { data: { IpfsHash: string; }; }) => {
            return `https://gateway.pinata.cloud/ipfs/${resp.data.IpfsHash}`
        })
        .catch((err: any) => {
            console.log(err)
            return ""
        });
}
