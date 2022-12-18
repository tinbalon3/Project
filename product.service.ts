import {Injectable} from "@angular/core";
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from "@angular/fire/compat/firestore";
import { map, Observable } from "rxjs";

@Injectable({
providedIn:'root',
})

export class ProductService {
  ItemCollectiom: AngularFirestoreCollection<any>;
  Item: Observable<any[]>;
  MenuCollectiom: AngularFirestoreCollection<any>;
  Menu: Observable<any[]>;
  isMenu = false;
constructor(public db:AngularFirestore){
  // item
  this.ItemCollectiom = this.db.collection('product');
  this.Item = this.ItemCollectiom.snapshotChanges().pipe(map((actions:any[]) => actions.map(a => {
    const data = a.payload.doc.data(); //lấy data
    const id = a.payload.doc.id; //lấy id
    return { id, ...data };
    })))

    // menu
    this.MenuCollectiom = this.db.collection('menu');
    this.Menu = this.MenuCollectiom.snapshotChanges().pipe(map((actions:any[]) => actions.map(a => {
    const data = a.payload.doc.data();
    const id = a.payload.doc.id;
    return { id, ...data };
    })))
}
product : any = {
type: '',
name : '',
des: '',
qty: '',
price: ''
}

addProduct(data : any)
{
  this.ItemCollectiom.add(data);
}
addMenuList(data:any)
{
  this.MenuCollectiom.add(data);
}
deleteItem(id:string)
{
  this.ItemCollectiom.doc(id).delete();
}
getItem() {
  return this.Item;
}
getMenu()
{
  return this.Menu;
}
getDataEdit()
{
  return this.product;
}
EditItem(data:any,id:string) {
this.ItemCollectiom.doc(id).set(data);
}
//show ra sản phẩm đúng như kiểu mình lọc
getItemType(data:string) {
return new Promise<any>((resolve)=> {
this.db.collection(data).valueChanges({ idField: 'id' }).subscribe((ss)=> resolve(ss));
})
}

getIsMenu()
{
  this.isMenu = !this.isMenu;
  return this.isMenu;
}
}

