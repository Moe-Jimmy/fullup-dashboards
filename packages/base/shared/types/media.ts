/** Pan/zoom state of a crop, kept so re-opening the cropper resumes where the
 *  user left off instead of re-centring. Offsets are in stage pixels. */
export interface CropState {
  zoom: number;
  offsetX: number;
  offsetY: number;
}
