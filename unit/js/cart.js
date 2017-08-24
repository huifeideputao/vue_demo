var vm = new Vue({
	el:"#app",
	data:{
		totalMoney:0,
		productList:[],
		checkAllFlag:false,
		delFlag:false,
		curProduct:''
		
	},
	filters:{ //过滤器
		formatMoney: function(value){
			return "￥" + value.toFixed(2)
		}
	},
	mounted: function(){ //准备完成执行的代码
		this.$nextTick(function(){
			vm.cartView();
		})
		
	},
	methods:{ //事件绑定都在这里
		cartView:function(){
			var _this = this;
			this.$http.get("data/cartData.json",{"id":123}).then(function (res) {
				_this.productList = res.data.result.list;
				// _this.totalMoney = res.data.result.totalMoney;
			});
		},
		//增加和减少商品数量 
		changeMoney:function(product,way){
			if(way>0){
				product.productQuentity++;
			}else{
				product.productQuentity--;
				if(product.productQuentity<1){
					product.productQuentity = 1;
				}
			}
			this.calcTotalPrice();
		},
		//单选效果
		selectedProduct: function(item){
			if(typeof item.checked == 'undefined'){
				this.$set(item,"checked",true);//局部注册
				// Vue.set(item,"checked",true); 全局注册
			}else{
				item.checked = !item.checked;
			}
			this.calcTotalPrice();
		},
		// 全选效果
		checkAll:function(flag){
			this.checkAllFlag = flag;
			var _this = this;
			this.productList.forEach(function(item,index){
				if(typeof item.checked == 'undefined'){
					_this.$set(item,"checked",_this.checkAllFlag);
				}else{
					item.checked = _this.checkAllFlag;
				}
			})
			this.calcTotalPrice();
		},
		// 总金额计算 为单选全选 增加数量绑定
		calcTotalPrice:function(){
			var _this = this;
			this.totalMoney = 0;
			this.productList.forEach(function(item,index){
				if(item.checked){
					_this.totalMoney += item.productPrice*item.productQuentity;
				}
			});
		},
		delConfirm:function(item){
			this.delFlag=true;
			this.curProduct = item;
		},
		delProduct: function(){
			var index = this.productList.indexOf(this.curProduct);
			this.productList.splice(index,1);
			this.delFlag=true;
		}

		//ES6
		// cartView:function(){
		// 	let _this = this;
		// 	this.$http.get("data/cartData.json",{"id":123}).then(res=> {
		// 		this.productList = res.data.result.list;
		// 		this.totalMoney = res.data.result.totalMoney;
		// 	});
		// }
		
	}
});
//全局过滤器
Vue.filter("money",function(value,type){
	return "￥" + value.toFixed(2) + type;
})