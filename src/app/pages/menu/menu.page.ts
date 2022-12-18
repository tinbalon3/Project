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
    des: ''
  }

  product_add : any = {
    name : '',
    des: '',
    qty: '',
    price: '',
    type: ''
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
    console.log(this.exist)
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
//hiển thị sản phẩm theo type
 settype(type:string)
  {
    if(type == "Tất cả")
    {
      this.name = type;
      this.pushDataProduct();
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
        console.log(this.product);
        if(this.product.length == 0)
          this.exist = false;
        else if(this.product.length !=0)
          this.exist = true;
        this.getallID();

        console.log(this.exist + "123")


    })
    }


  }
  //delete
  deleteItem()
  {
      this.productService.deleteItem(this.allId[this.index_delete]);
      this.pushDataProduct()
      this.close();
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
    this.productService.EditItem(this.product_edit,this.allId[this.index]);
    alert("Sửa thành công");
    this.checked = !this.checked;
  }

  //add
  addProduct()
  {
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
    console.log(this.modal+''+this.isMenu)
    // this.isAdd = !this.isAdd;
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
    console.log(this.modal+''+this.isAdd)
    // this.isMenu = !this.isMenu;
  }
}
