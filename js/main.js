/* Moralis init code */
fetch('./js/env.json')
    .then(response => response.json())
    .then(async data => {
        const serverUrl = data.env.MORALIS_SERVER_URL;
        const appId = data.env.MORALIS_APPLICATION_ID;
        Moralis.start({ serverUrl, appId });
        let license = "All Rights Reserved";

        let query = new Moralis.Query('Tokens');
        let subscription = await query.subscribe();
        console.log('subscribed');
        subscription.on('create', (object) => {
            console.log('object created');
            console.log(object);
        });

        /* Authentication code */
        async function login() {
            console.log("Login to Moralis");
            let user = Moralis.User.current();
            if (!user) {
                user = await Moralis.authenticate({
                    signingMessage: "Log in using Moralis",
                })
                    .then(function (user) {
                        console.log("logged in user:", user);
                        console.log(user.get("ethAddress"));
                        document.getElementById("wallet-address").innerHTML = user.get("ethAddress");
                    })
                    .catch(function (error) {
                        console.log(error);
                    });
                await Moralis.enableWeb3();
            }
        }

        async function logOut() {
            await Moralis.User.logOut();
            console.log("Logged out of Moralis");
            document.getElementById("wallet-address").innerHTML = "Wallet Address"
        }

        async function nd() {
            license = "All Rights Reserved";
        }

        async function nc() {
            license = "Some Rights Reserved";
        }

        async function by() {
            license = "All Rights Relinquished";
        }

        async function upload() {
            const fileInput = document.getElementById("file-upload");
            const name = document.getElementById("item-name").value;
            const externalLink = document.getElementById("item-external-link").value;
            const description = document.getElementById("item-description").value;
            const unlockableContent = document.getElementById("unlockable-content").checked;
            const sensitiveContent = document.getElementById("sensitive-content").checked;
            const confirmAuthority = document.getElementById("confirm-authority").checked;
            const termsConditions = document.getElementById("terms-conditions").checked;
            // Save file input to IPFS
            const data = fileInput.files[0];
            const file = new Moralis.File(data.name, data);
            await file.saveIPFS();

            const metadata = {
                "name": name,
                "externalLink": externalLink,
                "description": description,
                "unlockableContent": unlockableContent,
                "sensitiveContent": sensitiveContent,
                "confirmAuthority": confirmAuthority,
                "termsAndConditions": termsConditions,
                "tokenURI": file.ipfs()
            }

            const nftFile = new Moralis.File("file.json", { base64: btoa(JSON.stringify(metadata)) });
            await nftFile.saveIPFS();

            console.log(nftFile.ipfs());

            let options = {
                contractAddress: "0xa550983721b016611112edf9f24AEce3765683e0",
                functionName: "createToken",
                abi: [
                    {
                        "inputs": [],
                        "stateMutability": "nonpayable",
                        "type": "constructor"
                    },
                    {
                        "anonymous": false,
                        "inputs": [
                            {
                                "indexed": true,
                                "internalType": "address",
                                "name": "owner",
                                "type": "address"
                            },
                            {
                                "indexed": true,
                                "internalType": "address",
                                "name": "approved",
                                "type": "address"
                            },
                            {
                                "indexed": true,
                                "internalType": "uint256",
                                "name": "tokenId",
                                "type": "uint256"
                            }
                        ],
                        "name": "Approval",
                        "type": "event"
                    },
                    {
                        "anonymous": false,
                        "inputs": [
                            {
                                "indexed": true,
                                "internalType": "address",
                                "name": "owner",
                                "type": "address"
                            },
                            {
                                "indexed": true,
                                "internalType": "address",
                                "name": "operator",
                                "type": "address"
                            },
                            {
                                "indexed": false,
                                "internalType": "bool",
                                "name": "approved",
                                "type": "bool"
                            }
                        ],
                        "name": "ApprovalForAll",
                        "type": "event"
                    },
                    {
                        "anonymous": false,
                        "inputs": [
                            {
                                "indexed": true,
                                "internalType": "address",
                                "name": "from",
                                "type": "address"
                            },
                            {
                                "indexed": true,
                                "internalType": "address",
                                "name": "to",
                                "type": "address"
                            },
                            {
                                "indexed": true,
                                "internalType": "uint256",
                                "name": "tokenId",
                                "type": "uint256"
                            }
                        ],
                        "name": "Transfer",
                        "type": "event"
                    },
                    {
                        "inputs": [
                            {
                                "internalType": "address",
                                "name": "to",
                                "type": "address"
                            },
                            {
                                "internalType": "uint256",
                                "name": "tokenId",
                                "type": "uint256"
                            }
                        ],
                        "name": "approve",
                        "outputs": [],
                        "stateMutability": "nonpayable",
                        "type": "function"
                    },
                    {
                        "inputs": [
                            {
                                "internalType": "address",
                                "name": "owner",
                                "type": "address"
                            }
                        ],
                        "name": "balanceOf",
                        "outputs": [
                            {
                                "internalType": "uint256",
                                "name": "",
                                "type": "uint256"
                            }
                        ],
                        "stateMutability": "view",
                        "type": "function"
                    },
                    {
                        "inputs": [
                            {
                                "internalType": "string",
                                "name": "tokenURI",
                                "type": "string"
                            }
                        ],
                        "name": "createToken",
                        "outputs": [
                            {
                                "internalType": "uint256",
                                "name": "",
                                "type": "uint256"
                            }
                        ],
                        "stateMutability": "nonpayable",
                        "type": "function"
                    },
                    {
                        "inputs": [
                            {
                                "internalType": "uint256",
                                "name": "tokenId",
                                "type": "uint256"
                            }
                        ],
                        "name": "getApproved",
                        "outputs": [
                            {
                                "internalType": "address",
                                "name": "",
                                "type": "address"
                            }
                        ],
                        "stateMutability": "view",
                        "type": "function"
                    },
                    {
                        "inputs": [
                            {
                                "internalType": "address",
                                "name": "owner",
                                "type": "address"
                            },
                            {
                                "internalType": "address",
                                "name": "operator",
                                "type": "address"
                            }
                        ],
                        "name": "isApprovedForAll",
                        "outputs": [
                            {
                                "internalType": "bool",
                                "name": "",
                                "type": "bool"
                            }
                        ],
                        "stateMutability": "view",
                        "type": "function"
                    },
                    {
                        "inputs": [],
                        "name": "name",
                        "outputs": [
                            {
                                "internalType": "string",
                                "name": "",
                                "type": "string"
                            }
                        ],
                        "stateMutability": "view",
                        "type": "function"
                    },
                    {
                        "inputs": [
                            {
                                "internalType": "uint256",
                                "name": "tokenId",
                                "type": "uint256"
                            }
                        ],
                        "name": "ownerOf",
                        "outputs": [
                            {
                                "internalType": "address",
                                "name": "",
                                "type": "address"
                            }
                        ],
                        "stateMutability": "view",
                        "type": "function"
                    },
                    {
                        "inputs": [
                            {
                                "internalType": "address",
                                "name": "from",
                                "type": "address"
                            },
                            {
                                "internalType": "address",
                                "name": "to",
                                "type": "address"
                            },
                            {
                                "internalType": "uint256",
                                "name": "tokenId",
                                "type": "uint256"
                            }
                        ],
                        "name": "safeTransferFrom",
                        "outputs": [],
                        "stateMutability": "nonpayable",
                        "type": "function"
                    },
                    {
                        "inputs": [
                            {
                                "internalType": "address",
                                "name": "from",
                                "type": "address"
                            },
                            {
                                "internalType": "address",
                                "name": "to",
                                "type": "address"
                            },
                            {
                                "internalType": "uint256",
                                "name": "tokenId",
                                "type": "uint256"
                            },
                            {
                                "internalType": "bytes",
                                "name": "_data",
                                "type": "bytes"
                            }
                        ],
                        "name": "safeTransferFrom",
                        "outputs": [],
                        "stateMutability": "nonpayable",
                        "type": "function"
                    },
                    {
                        "inputs": [
                            {
                                "internalType": "address",
                                "name": "operator",
                                "type": "address"
                            },
                            {
                                "internalType": "bool",
                                "name": "approved",
                                "type": "bool"
                            }
                        ],
                        "name": "setApprovalForAll",
                        "outputs": [],
                        "stateMutability": "nonpayable",
                        "type": "function"
                    },
                    {
                        "inputs": [
                            {
                                "internalType": "bytes4",
                                "name": "interfaceId",
                                "type": "bytes4"
                            }
                        ],
                        "name": "supportsInterface",
                        "outputs": [
                            {
                                "internalType": "bool",
                                "name": "",
                                "type": "bool"
                            }
                        ],
                        "stateMutability": "view",
                        "type": "function"
                    },
                    {
                        "inputs": [],
                        "name": "symbol",
                        "outputs": [
                            {
                                "internalType": "string",
                                "name": "",
                                "type": "string"
                            }
                        ],
                        "stateMutability": "view",
                        "type": "function"
                    },
                    {
                        "inputs": [
                            {
                                "internalType": "uint256",
                                "name": "tokenId",
                                "type": "uint256"
                            }
                        ],
                        "name": "tokenURI",
                        "outputs": [
                            {
                                "internalType": "string",
                                "name": "",
                                "type": "string"
                            }
                        ],
                        "stateMutability": "view",
                        "type": "function"
                    },
                    {
                        "inputs": [
                            {
                                "internalType": "address",
                                "name": "from",
                                "type": "address"
                            },
                            {
                                "internalType": "address",
                                "name": "to",
                                "type": "address"
                            },
                            {
                                "internalType": "uint256",
                                "name": "tokenId",
                                "type": "uint256"
                            }
                        ],
                        "name": "transferFrom",
                        "outputs": [],
                        "stateMutability": "nonpayable",
                        "type": "function"
                    },
                    {
                        "inputs": [
                            {
                                "internalType": "address",
                                "name": "from",
                                "type": "address"
                            },
                            {
                                "internalType": "address",
                                "name": "to",
                                "type": "address"
                            },
                            {
                                "internalType": "uint256",
                                "name": "tokenId",
                                "type": "uint256"
                            }
                        ],
                        "name": "transferToken",
                        "outputs": [],
                        "stateMutability": "nonpayable",
                        "type": "function"
                    }
                ],
                params: {
                    tokenURI: nftFile.ipfs()
                },
                msgValue: Moralis.Units.ETH(0.0)
            }
            await Moralis.executeFunction(options).then((result) => {
                console.log(result);
                // Save file reference to Moralis
                const mints = new Moralis.Object("Mints");
                mints.set("name", "URIP Token");
                mints.set("ipfs", nftFile);
                mints.set("urip", license);
                mints.set("transaction", result.hash);
                mints.save().then(
                    (mint) => {
                        console.log(mint.id);
                    },
                    (error) => {
                        console.log(error);
                    },
                );
            });
        }

        document.getElementById("btn-login").onclick = login;
        document.getElementById("btn-logout").onclick = logOut;
        document.getElementById("btn-upload").onclick = upload;
        document.getElementById("btn-nd").onclick = nd;
        document.getElementById("btn-nc").onclick = nc;
        document.getElementById("btn-by").onclick = by;
    })
    .catch(error => console.log(error));