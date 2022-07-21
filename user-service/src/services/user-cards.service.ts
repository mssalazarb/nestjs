import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { GeneralResponse } from '../models/general-response';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { UserCards } from '../entities/user-cards.entity';

@Injectable()
export class UserCardsService {
  constructor(
    @InjectRepository(UserCards)
    private repository: Repository<UserCards>,
    private dataSource: DataSource,
  ) {}

  async saveCard(card: UserCards): Promise<GeneralResponse> {
    let oldCard;
    if (card.cardNumber && card.cvv && card.expiration) {
      oldCard = await this.searchCardByCriteria({
        card_number: card.cardNumber,
      });
    }

    if (oldCard) {
      throw new HttpException(
        'Error saving card, the user already have this card',
        HttpStatus.CONFLICT,
      );
    }

    const data = await this.repository.save(card);

    return {
      statusCode: HttpStatus.CREATED,
      data,
    };
  }

  async updateCard(card: UserCards): Promise<GeneralResponse> {
    if (card.id) {
      let oldCard = await this.searchCardByCriteria({ id: card.id });
      oldCard = Object.assign(oldCard, card);

      return this.updateById(oldCard);
    } else {
      throw new HttpException('Error updating card', HttpStatus.CONFLICT);
    }
  }

  async setCardDefault(cardId: number): Promise<GeneralResponse> {
    if (cardId) {
      const oldCard = await this.searchCardByCriteria({ default: true });
      oldCard.default = false;
      await this.updateById(oldCard);

      const card = await this.searchCardByCriteria({ id: cardId });
      card.default = true;

      return this.updateById(card);
    } else {
      throw new HttpException('Error updating card', HttpStatus.CONFLICT);
    }
  }

  async deleteCard(cardId: number): Promise<GeneralResponse> {
    if (cardId) {
      const card = await this.searchCardByCriteria({ id: cardId });
      card.deletedAt = new Date();

      return this.updateById(card);
    }
  }

  async getCardsByUser(userId: number): Promise<GeneralResponse> {
    const users = await this.dataSource
      .createQueryBuilder()
      .select('us.*')
      .from(UserCards, 'us')
      .where('deleted_at is null')
      .andWhere({ user_id: userId })
      .getRawMany();

    return {
      statusCode: HttpStatus.OK,
      data: users,
    };
  }

  async searchCardByCriteria(criteria: any) {
    return this.dataSource
      .createQueryBuilder()
      .select('us.*')
      .from(UserCards, 'us')
      .where(criteria)
      .andWhere('deleted_at is null')
      .getRawOne();
  }

  async updateById(card) {
    const data = await this.repository.update({ id: card.id }, card);

    return {
      statusCode: HttpStatus.OK,
      data: data.raw,
    };
  }
}
