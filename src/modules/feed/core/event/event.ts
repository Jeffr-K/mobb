export class FeedCreatedEvent {
  constructor(public readonly feed: { title: string; content: string; images: string[] }) {}
}
