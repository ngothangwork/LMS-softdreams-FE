export interface PublisherResponse {
  id: number;
  name: string;
  address: string;
  phone: string;
}

export interface PublisherCreate {
  name: string;
  address: string;
  phone: string;
}

export interface PublisherUpdate {
  name: string;
  address: string;
  phone: string;
}

export interface PublisherUpdateResponse {
  id: number;
  name: string;
}
