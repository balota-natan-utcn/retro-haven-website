import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { Observable } from "rxjs";

export interface Image {
    src: string;
}

@Injectable({
    providedIn: 'root'
})
export class BannerService {

    http = inject(HttpClient);

    getImage(): Observable<Image> {
        return this.http.get<Image>('http://localhost:3000/image');
    }
}
