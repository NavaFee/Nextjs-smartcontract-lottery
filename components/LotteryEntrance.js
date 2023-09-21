//
// have a function to enter the lottery
import { ethers } from "ethers"
import { useWeb3Contract } from "react-moralis"
import { abi, contractAddress } from "../constants" //index.js will represents this whole folder
import { useMoralis } from "react-moralis"
import { useEffect, useState } from "react"
import { useNotification } from "web3uikit"

export default function LotteryEntrance() {
    const { chainId: chainIdHex, isWeb3Enabled } = useMoralis()
    // console.log("chainId =", parseInt(chainIdHex))
    const chainId = parseInt(chainIdHex)
    const raffleAddress = chainId in contractAddress ? contractAddress[chainId][0] : null
    const [entranceFee, setEntranceFee] = useState("0")
    const [numPlayers, setNumPlayers] = useState("0")
    const [recentWinner, setRecentWinner] = useState("0")

    const dispatch = useNotification()
    const {
        runContractFunction: enterRaffle,
        isLoading,
        isFetching,
    } = useWeb3Contract({
        abi: abi,
        contractAddress: raffleAddress, //specify the networkId
        functionName: "enterRaffle",
        params: {},
        msgValue: entranceFee,
    })
    const { runContractFunction: getEntranceFee } = useWeb3Contract({
        abi: abi,
        contractAddress: raffleAddress, //specify the networkId
        functionName: "getEntranceFee",
        params: {},
    })

    const { runContractFunction: getNumberOfPlayers } = useWeb3Contract({
        abi: abi,
        contractAddress: raffleAddress, //specify the networkId
        functionName: "getNumberOfPlayers",
        params: {},
    })

    const { runContractFunction: getRecentWinner } = useWeb3Contract({
        abi: abi,
        contractAddress: raffleAddress, //specify the networkId
        functionName: "getRecentWinner",
        params: {},
    })

    async function updateUI() {
        const entranceFeeFromCall = (await getEntranceFee()).toString()
        const numPlayersFromCall = (await getNumberOfPlayers()).toString()
        const recentWinnerFromCall = (await getRecentWinner()).toString()
        setNumPlayers(numPlayersFromCall)
        setRecentWinner(recentWinnerFromCall)
        setEntranceFee(entranceFeeFromCall)
        console.log(entranceFeeFromCall)
    }

    useEffect(() => {
        if (isWeb3Enabled) {
            //try to read entranceFee

            updateUI()
        }
    }, [isWeb3Enabled])

    const handleSuccess = async function (tx) {
        await tx.wait(1)
        handleMewNotifaction(tx)
        updateUI()
    }
    const handleMewNotifaction = function () {
        dispatch({
            type: "info",
            message: "Transaction Complete!",
            title: "Tx Notification",
            position: "topR",
            icon: "",
        })
    }

    return (
        <div className="p-5">
            Hi from LotteryEntrance
            {raffleAddress ? (
                <div>
                    <button
                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded ml-auto"
                        onClick={async function () {
                            enterRaffle({
                                // on complete
                                // on error
                                onSuccess: handleSuccess,
                                onError: (error) => {
                                    console.log(error)
                                },
                            })
                        }}
                        disabled={isLoading || isFetching}
                    >
                        {isLoading || isFetching ? (
                            <div className="animate-spin spinner-border h-8 w-8 border-b-2 rounded-none"></div>
                        ) : (
                            <div>Enter Raffle</div>
                        )}
                    </button>
                    <div>
                        Entrance Fee: {ethers.utils.formatEther(entranceFee)} ETH <br></br> Number
                        Of Players: {numPlayers}
                        <br></br>Recent Winner: {recentWinner}
                    </div>
                </div>
            ) : (
                <div>NO Raffle Address Detected</div>
            )}
        </div>
    )
}
