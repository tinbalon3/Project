import { Component, Input, OnInit } from '@angular/core';
import { ProductService } from 'product.service';
@Component({
  selector: 'app-menu',
  templateUrl: './menu.page.html',
  styleUrls: ['./menu.page.scss'],
})
export class MenuPage implements OnInit {
  @Input() checked = false;
  @Input() name = 'Tất cả';
  @Input() delete = false;
  listMenu :any[];
  product: any[] ;
  allId:any[];
  product_list: any[] ;
  index = 0;
  index_delete = 0;
  isMenu = false;
  isAdd = false;
  modal = false;
  exist = true;
  product_edit : any = {
    type: '',
    name : '',
    price: '',
    qty: '',
    des: '',
    file:''
  }

  product_add : any = {
    name : '',
    des: '',
    qty: '',
    price: '',
    type: '',
    file:''
  }
  menu : any = {
    name:'',
    type:''
  }


  constructor(private productService: ProductService) {
    this.listMenu = [];
    this.product = [];
    this.allId = [];
    this.product_list = [];
  }

  ngOnInit() {
   this.productService.getMenu().subscribe((menu:any) => {this.listMenu = menu;})
    this.productService.getItem().subscribe((item:any) => {this.product = item;this.getallID();})
    this.productService.getMenu().subscribe((item:any) => {this.product_list = item;})
  }
  //Lấy tất cả id của sản phẩm lưu vào biến local
  getallID()
  {
    if(this.allId.length > 0)
    this.allId = [];
    this.product.forEach(item => this.allId.push(item.id));
  }
  //Lấy data từ firebase về
   pushDataProduct() {
    this.productService.getItem().subscribe((item:any) => {
      this.product = item;
      this.getallID();
      })
  }
  pushDataMenu() {
    this.productService.getMenu().subscribe((item:any) => {
      this.listMenu = item;
      })
  }
//hiển thị sản phẩm theo type
 settype(type:string)
  {
    if(type == "Tất cả")
    {
      this.name = type;
      this.pushDataProduct();
      this.exist = true;
    }
    else
    {
      this.product = [];
      this.name = type;
      this.productService.getItem().subscribe(item => {
      for(let i of item)
        if(i.type == type)
        {
          this.product.push(i);
        }
        if(this.product.length == 0)
          this.exist = false;
        else if(this.product.length !=0)
          this.exist = true;
        this.getallID();

    })
    }


  }
  //delete item
  deleteItem()
  {
      this.productService.deleteItem(this.allId[this.index_delete]);
      this.pushDataProduct()
      this.close();
  }
  //delete menu
  deleteMenu(item:any)
  {
    this.product.forEach(product => {
      if(product.type == item.type)
      {
        this.productService.deleteItem(product.id);
      }
    })
      this.productService.deleteMenu(item.id);
  }
  //bật mở modal delete
  close()
  {
    this.delete = !this.delete;
  }
  openModalDelete(i:number)
  {
    this.close();
    this.index_delete = i;
  }
  //edit
  setDataEdit(item:any,index:number)
  {
    this.checked = !this.checked;
    this.product_edit = item;
    this.index = index;
  }

  EditProduct()
  {
    this.product_edit.price = parseFloat(this.product_edit.price);
    this.product_edit.qty = parseFloat(this.product_edit.qty);
    this.productService.EditItem(this.product_edit,this.allId[this.index]);
    alert("Sửa thành công");

  }
  //add
  addProduct()
  {
    //Vì em chưa xử lý up ảnh lên được nên em gán thẳng cho nó 1 bức ảnh up lên firebase
    this.product_add.file = 'https://ionicframework.com/docs/img/demos/thumbnail.svg';
    this.product_add.price = parseFloat(this.product_add.price);
    this.product_add.qty = parseFloat(this.product_add.qty);
    this.productService.addProduct(this.product_add);
    alert("Thêm thành công");
    this.resetData();
  }

  addMenu()
  {
    this.productService.addMenuList(this.menu);
    alert("Thêm thành công");
    this.resetMenu();
  }
  resetData()
  {
    this.product_add = {
      name: '',
      des: '',
      qty: '',
      price: '',
      type: ''

    }
  }
  resetMenu()
  {
    this.menu = {
      name : '',
      type:''
    }
  }
  closeModalMenu()
  {
    this.modal = false;
    this.isMenu = false;
    console.log(this.modal+''+this.isMenu)
  }
  openModalMenu()
  {
    this.modal = true;
    this.isMenu = true;
  }
  closeModalProduct()
  {
    this.modal =  false;
    this.isAdd = false;
    console.log(this.modal+''+this.isAdd)
  }
  openModalProduct()
  {
    this.modal = true;
    this.isAdd = true;
  }
}
