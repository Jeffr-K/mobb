import { ProfilePersonaContractSpecification } from '@modules/user/interface/specs/profile.specification';

export class ProfilePersonaResponseAdapter implements ProfilePersonaContractSpecification {
  contact: { email: string; github: string; blog: string };
  personal: { name: string; description: string; job: string; personality: string; interests: string[] };
  // identity: { frontend: string; backend: string; tools: string };
  location: { address: string; education: string; experience: string };

  constructor(
    contact: { email: string; github: string; blog: string },
    personal: { name: string; description: string; job: string; personality: string; interests: string[] },
    // identity: { frontend: string; backend: string; tools: string },
    location: { address: string; education: string; experience: string },
  ) {
    this.contact = contact;
    this.personal = personal;
    // this.identity = identity;
    this.location = location;
  }
}
