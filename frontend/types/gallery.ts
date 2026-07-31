export interface GallerySubject {
  id: number;
  images: number;
  files: string[];
}

export interface GalleryResponse {
  total_subjects: number;
  total_images: number;
  subjects: GallerySubject[];
}

export interface MeanFaceResponse {
  image_url: string;
}

export interface EigenfaceItem {
  index: number;
  eigenvalue: number;
  explained_variance_ratio: number;
  image_url: string;
}

export interface EigenfacesResponse {
  count: number;
  n_components: number;
  eigenfaces: EigenfaceItem[];
}