import { Injectable } from '@nestjs/common';
import  {Address, createPublicClient, http, formatUnits, createWalletClient, hexToString} from 'viem';
import {sepolia} from 'viem/chains';
import * as tokenJson from './assets/JamToken.json';
import * as ballotJson from './assets/TokenizedBallot.json';
import { privateKeyToAccount } from 'viem/accounts';

@Injectable()
export class AppService {
  publicClient;
  walletClient;

  constructor() {
    this.publicClient = createPublicClient({
      chain: sepolia,
      transport: http(process.env.RPC_ENDPOINT_URL),
    });

    this.walletClient = createWalletClient({
      account: privateKeyToAccount(`0x${process.env.PRIVATE_KEY}`),
      chain: sepolia,
      transport: http(process.env.RPC_ENDPOINT_URL),
    })
  }

  getHello(): string {
    return 'Hello World!';
  }

  getContractAddress(): Address {
    return process.env.TOKEN_ADDRESS as Address;
  }

  async getTokenName(): Promise<any> {
    const name = await this.publicClient.readContract({
      address: this.getContractAddress(),
      abi: tokenJson.abi,
      functionName: "name"
    });
    return name;
  }

  async getTotalSupply(): Promise<any> {
    const supply = await this.publicClient.readContract({
      address: this.getContractAddress(),
      abi: tokenJson.abi,
      functionName: "totalSupply"
    })

    const symbol = await this.publicClient.readContract({
      address: this.getContractAddress(),
      abi: tokenJson.abi,
      functionName: "symbol"
    });

    const decimals = await this.publicClient.readContract({
      address: this.getContractAddress(),
      abi: tokenJson.abi,
      functionName: "decimals"
    });

    const supplyString = `${formatUnits(supply, decimals)} ${symbol}`;
    return supplyString;
  }

  async getTokenBalance(address: Address): Promise<any> {
    const balance = await this.publicClient.readContract({
      address: this.getContractAddress(),
      abi: tokenJson.abi,
      functionName: "balanceOf",
      args: [address]
    })

    const symbol = await this.publicClient.readContract({
      address: this.getContractAddress(),
      abi: tokenJson.abi,
      functionName: "symbol"
    });

    const decimals = await this.publicClient.readContract({
      address: this.getContractAddress(),
      abi: tokenJson.abi,
      functionName: "decimals"
    });

    const balanceString = `${formatUnits(balance, decimals)} ${symbol}`;
    return balanceString;
  }

  async getTransactionReceipt(hash: string): Promise<any> {
    return this.publicClient.getTransactionReceipt(hash);
  }

  getServerWalletAddress(): Address {
    return this.walletClient.account.address;
  }

  async checkMinterRole(address: string): Promise<any> {
    const MINTER_ROLE = "0x9f2df0fed2c77648de5860a4cc508cd0818c85b8b8a1ab4ceeef8d981c8956a6"
    
    const hasRole = await this.publicClient.readContract({
      address: this.getContractAddress(),
      abi: tokenJson.abi,
      functionName: "hasRole",
      args: [MINTER_ROLE, address]
    });

    return hasRole ? `${address} has Minter role` : `${address} does not have  Minter role`;

  }

  async mintTokens(address: any, amount: any): Promise<any> {
    // This won't work because I don't have MINTER_ROLE
    const txHash = await this.walletClient.writeContract({
      address: this.getContractAddress(),
      abi: tokenJson.abi,
      functionName: "mint",
      args: [address, BigInt(amount)]
    })

    // const receipt = await this.publicClient.waitForTransaction({
    //   hash: txHash
    // });




    return `Minted ${amount} tokens to ${address}`;
  }

  async delegateTokens(address: Address) {

    const txHash = await this.walletClient.writeContract({
      address: this.getContractAddress(),
      abi: tokenJson.abi,
      functionName: "delegate",
      args: [address]
    })

    return `Delegated tokens to ${address}\n Transaction Hash: ${txHash}`
  }

  async vote(position: string, amount: string, address: Address) {

    const txHash = await this.walletClient.writeContract({
      address: "0xf4b8d17bde27a99e1602ecbb42c39bfd544168fc",
      abi: ballotJson.abi,
      functionName: "vote",
      args: [BigInt(position), BigInt(amount)],
      from: address,
    })

    return `Voted on position ${position} for ${amount} tokens\n Transaction Hash: ${txHash}`

  }
  
  async getWinner() {
    const winner = await this.publicClient.readContract({
      address: "0xf4b8d17bde27a99e1602ecbb42c39bfd544168fc",
      abi: ballotJson.abi,
      functionName: "winnerName"
    })
    return hexToString(winner, {size : 32})
  }

  async grantRole(address: Address) {
    await this.walletClient.writeContract({
      address: this.getContractAddress(),
      abi: tokenJson.abi,
      functionName: "grantRole",
      args: ["0x9f2df0fed2c77648de5860a4cc508cd0818c85b8b8a1ab4ceeef8d981c8956a6", address]
    })
  }

  async delegate( address: Address) {
    await this.walletClient.writeContract({
      address: this.getContractAddress(),
      abi: tokenJson.abi,
      functionName: "delegate",
      args: [address]
    })
  }
}
