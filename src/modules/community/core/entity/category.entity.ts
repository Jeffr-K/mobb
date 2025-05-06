import { Entity } from '@mikro-orm/core';
import { AggregateRoot } from '@nestjs/cqrs';

@Entity({})
export class Category extends AggregateRoot {}