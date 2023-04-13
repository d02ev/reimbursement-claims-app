import {
  Controller,
  UseGuards,
  Post,
  UseInterceptors,
  Body,
  UploadedFile,
} from '@nestjs/common';
import { GetUser, UseRole } from 'src/auth/decorators';
import { AuthenticatedGuard } from 'src/auth/guards';
import { Role } from 'src/user/enum';
import { CreateClaimDto } from './dto';
import { extname } from 'path';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { ClaimService } from './claim.service';

@Controller('claim')
export class ClaimController {
  constructor(private readonly _claimService: ClaimService) {}

  @UseGuards(AuthenticatedGuard)
  @UseRole(Role.USER)
  @Post()
  @UseInterceptors(
    FileInterceptor('receipt', {
      storage: diskStorage({
        destination: './client/src/assets/receipts',
        filename: (req, file, cb) => {
          return cb(
            null,
            `${Date.now()}_${file.fieldname}${extname(file.originalname)}`,
          );
        },
      }),
    }),
  )
  public async generate(
    @Body() claimData: CreateClaimDto,
    @UploadedFile() receiptImg: Express.Multer.File,
    @GetUser('id') userId: string,
  ): Promise<any> {
    claimData.receipt = receiptImg.path;
    claimData.requestedBy = userId;
    return await this._claimService.generateClaim(claimData);
  }
}
