declare module 'leaflet' {
  const L: {
    map(el: HTMLElement | string, options?: any): any;
    tileLayer(url: string, options?: any): any;
    marker(latlng: [number, number], options?: any): any;
    divIcon(options?: any): any;
    control: {
      zoom(options?: any): any;
    };
  };
  export default L;
}
