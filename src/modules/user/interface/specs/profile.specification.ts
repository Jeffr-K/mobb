export interface ProfilePersonaContractSpecification {
  contact: {
    email: string;
    github: string;
    blog: string;
  };
  personal: {
    name: string;
    description: string;
    job: string;
    personality: string;
    interests: string[];
  };
  // identity: {
  //   frontend: string;
  //   backend: string;
  //   tools: string;
  // };
  location: {
    address: string;
    education: string;
    experience: string;
  };
}