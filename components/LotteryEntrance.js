//
// have a function to enter the lottery
import { useWeb3Contract } from "react-moralis"

export default function LotteryEntrance() {
    const {runContractFunction:enterRaffle} = useWeb3Contract({
        abi:,//
        contractAddress: ,//,
        functionName:,
        params:,
        msgValue:,
    })
    return (
        <div>
            <button>Hi from LotteryEntrance</button>
        </div>
    )
}
