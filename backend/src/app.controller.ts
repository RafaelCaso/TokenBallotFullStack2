import { Controller, Get, Param, Query, Post, Body } from '@nestjs/common';
import { AppService } from './app.service';
import {Address} from 'viem';
import { MintTokenDto } from './dtos/mintToken.dto';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('contract-address')
  getContractAddress(){
    return {result: this.appService.getContractAddress()};
  }

  @Get('token-name')
  async getTokenName() {
    return {result: await this.appService.getTokenName()};
  }

  @Get('total-supply')
  async getTotalSupply() {
    return {result: await this.appService.getTotalSupply()};
  }

  @Get('token-balance/:address')
  async getTokenBalance(@Param('address') address: Address) {
    return {result: await this.appService.getTokenBalance(address)};
  }

  @Get('transaction-receipt')
  async getTransactionReceipt(@Query('hash') hash: string) {
    return {result: await this.appService.getTransactionReceipt(hash)};
  }

  @Get('server-wallet-address')
  getServerWalletAddress() {
    return {result: this.appService.getServerWalletAddress()};
  }

  @Get('check-minter-role')
  async checkMinterRole(@Query('address') address: string) {
    return {result: await this.appService.checkMinterRole(address)};
  }

  @Post('mint-tokens')
  async mintTokens(@Body() body: MintTokenDto) {
    return {result: await this.appService.mintTokens(body.address, body.amount)};
  }

  @Post('vote')
  async vote(@Body('position') position: string, @Body('amount') amount: string, @Body('address') address: Address) {
    return {result: await this.appService.vote(position, amount, address)};
  }

  @Post('delegate-tokens')
  async delegateTokens(@Query('address') address: Address) {
    return {result: await this.appService.delegateTokens(address)};
  }

  @Get('winner')
  async getWinner() {
    return {result: await this.appService.getWinner()};
  }

  @Post("grant-role")
  async grantRole(@Body('address') address: Address) {
    return {result: await this.appService.grantRole(address)}
    
  }
  
  @Post("delegate")
  async delegate( @Body('address') address: Address) {
    return {result: await this.appService.delegate(address)}
  }

}
