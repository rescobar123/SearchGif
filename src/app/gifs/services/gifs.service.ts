import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { SearchGIFResponse, Gif } from '../interfaces/gifs.interface';


@Injectable({
  providedIn: 'root'//le dice a angular que el servicio sera unico y de manera global a la aplicacion de angular, 
})
export class GifsService {
  private _historial: string[]=[];
  private apiKey: string = 'W5anPrJ630P6mAd8bhgcAdKDAYnSCzjn';
  private servicioUrl: string = 'https://api.giphy.com/v1/gifs';
  //TODO cambiar any por su tipo correspondiente.
  public resultados: Gif[] = [];

  get historial(){
    return [...this._historial];//regresamos un nuevo arreglo
  }

  constructor(private http: HttpClient){//vamos a llamar el servicio, inyeccion de dependencia
    this._historial = JSON.parse(localStorage.getItem('historial')!) || []; 
    this.resultados = JSON.parse(localStorage.getItem('resultados')!) || []; 
  }
  buscarGifs(query: string = ''){
    query = query.trim().toLocaleLowerCase();

    if(!this._historial.includes(query)){//pregunta sino esta el nuevo string y si no esta que lo agregue con unshift
      
      this._historial.unshift(query);//aca se agrega al inicio del arreglo el string

      localStorage.setItem('historial',JSON.stringify(this._historial));
      
      this._historial = this._historial.splice(0,10);
    }

    //HttpParams()
    const params = new HttpParams()
    .set('api_key', this.apiKey)
    .set('limit', '10')
    .set('q', query);

    console.log(params.toString());
    //usando http, propiedad que cree de tipo httpClient
    this.http.get<SearchGIFResponse>(`${this.servicioUrl}/search?`, { params: params })//se puede mandar solo params, porque es redundante
      .subscribe((resp) => {
        this.resultados = resp.data;
        localStorage.setItem('resultados',JSON.stringify(this.resultados));
      });

    /*
      ESTE ES JAVASCRIPT
    fetch('https://api.giphy.com/v1/gifs/search?api_key=W5anPrJ630P6mAd8bhgcAdKDAYnSCzjn&q=dragon ball z&limit=10')//propio de javascript
    .then( resp => {
      resp.json().then(data => console.log(data));
    }); //hacerlo con javascript, */
    /*colocando el prefico async al metodo buscarGifs se puede hacer asi:
    const resp = await fetch('https://api.giphy.com/v1/gifs/search?api_key=W5anPrJ630P6mAd8bhgcAdKDAYnSCzjn&q=dragon ball z&limit=10');
    const data = await resp.json();
    console.log(data)
    */
  }
}
