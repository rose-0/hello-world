<template>
  <div>
    <!--  面包屑导航区域-->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item><a href="/">权限管理</a></el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片试图 -->
    <el-card>
      <!--  添加角色按钮区-->
      <el-row>
        <el-col>
          <el-button type="primary"> 添加角色 </el-button>
        </el-col>
      </el-row>

      <!--角色列表区 -->
      <el-table :data="rolelist" border stripe>
        <!-- 展开列 -->
        <el-table-column type="expand">
          <template slot-scope="scope">
            <!-- i1表示索引 为0 即第一个上面加边框 否则不加-->
            <el-row
              :class="['bdbottom', i1 == 0 ? 'bdtop' : '', 'vcenter']"
              v-for="(item1, i1) in scope.row.children"
              :key="item1.id"
            >
              <!-- 渲染一级权限 独占一行-->
              <el-col :span="5">
                <el-tag closable @close="removeRightById(scope.row, item1.id)">
                  {{ item1.authName }}
                </el-tag>
                <!-- /后面小图标 -->
                <i class="el-icon-caret-right"></i>
              </el-col>
              <!-- 渲染二级和三级权限 -->
              <el-col :span="19">
                <!-- 通过for循环嵌套渲染二级权限 -->
                <el-row
                  :class="[i2 === 0 ? '0' : 'bdtop', 'vcenter']"
                  v-for="(item2, i2) in item1.children"
                  :key="item2.id"
                >
                  <!-- 左边6列 -->
                  <el-col :span="6">
                    <el-tag
                      type="success"
                      closable
                      @close="removeRightById(scope.row, item2.id)"
                      >{{ item2.authName }}</el-tag
                    >
                    <i class="el-icon-caret-right"></i>
                  </el-col>
                  <!-- 右边18列 -->
                  <el-col :span="18">
                    <!-- scope.row包含角色id,item3.id 权限id-->
                    <el-tag
                      type="warning"
                      v-for="(item3, i3) in item2.children"
                      :key="item3.id"
                      closable
                      @close="removeRightById(scope.row, item3.id)"
                    >
                      {{ item3.authName }}
                    </el-tag>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
            <!-- <pre>
                     {{scope.row}}
                    </pre> -->
          </template>
        </el-table-column>
        <!-- 索引列  -->
        <el-table-column type="index"></el-table-column>
        <el-table-column label="角色名称" prop="roleName"></el-table-column>
        <el-table-column label="角色描述" prop="roleDesc"></el-table-column>
        <el-table-column label="操作" width="300px">
          //因为需要自定义这一列渲染的样子
          所以通过作用域插槽的形式自定义输出格式
          <template slot-scope="scope">
            <el-button size="mini" type="primary" icon="el-icon-edit"
              >编辑</el-button
            >
            <el-button size="mini" type="danger" icon="el-icon-delete"
              >删除</el-button
            >
            <el-button
              size="mini"
              type="warning"
              icon="el-icon-setting"
              @click="showSetRightDialog(scope.row)"
              >分配权限</el-button
            >
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <!-- 分配权限的对话框 -->
    <el-dialog
      title="分配权限"
      :visible.sync="setRightDialogVisble"
      width="50%"
      @close="setRightDialogClosed"
    >
<!-- 树形控件 -->
<!--  props数据绑定哪个属性-->
<el-tree :data="rightslist" :props="treeProps" 
show-checkbox node-key="id" default-expand-all :default-checked-keys="defKeys"	
ref="treeRef"></el-tree>
      <span slot="footer" class="dialog-footer">
        <el-button @click="setRightDialogVisble = false">取 消</el-button>
        <el-button type="primary" @click="allotRights"
          >确 定
          </el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
    data(){
        return{
            //所有角色列表数据
            rolelist:[],
            //控制分配权限对话框的显示和隐藏
            setRightDialogVisble:false,
            //保存所有权限的数据
            rightslist:[],
            //树形控件的属性绑定对象
            treeProps:{
                label:'authName',//看到哪个值
                children:'children'//父子节点通过哪个属性嵌套
            },
            //默认选中的节点id值数组
            defKeys:[],
            // 当前分配权限的角色id
            roleId:''
        }
    },
    created(){
        this.getRolesList()
    },
    methods:{
        //获取角色列表数据
        async getRolesList(){
            const{data:res}= await this.$http.get('roles')
            if(res.meta.status!==200){
                return this.$message.error("获取角色列表失败！")
            }
            //获得的数据赋值
            this.rolelist=res.data
            console.log(this.rolelist)
        },
        //根据id删除对于的权限
        async removeRightById(role,rightId){
            //弹框提示
        const confirmResult= await this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).catch(err=>err)
        

        if(confirmResult!=='confirm'){
            return this.$message.info('取消了删除')
        }

        console.log('确认了删除')
        //后台真正删除
        const {data:res} = await this.$http.delete(`roles/${role.id}/rights/${rightId}`)
        if(res.meta.status!==200){
            return this.$message.error('删除权限失败')
        }
        //调用这个函数会重新渲染整个页面
        // this.getRolesList()

        //接口文档写到 返回的数据包含角色的最新权限
        role.children=res.data

        // this.$message.error('删除权限失败')
        },
        //展示分配权限的对话框
        async showSetRightDialog(role){
            this.roleId=role.id;
            //弹框先获取所有权限
            const{data:res}=await this.$http.get('rights/tree')
            if(res.meta.status!==200){
                return this.$message.error('获取权限数据失败')
            }
            //获取到的权限数据保存到自定义的data里面
            this.rightslist=res.data
            console.log(this.rightslist)
            //获取三级节点的id
            this.getLeafKeys(role,this.defKeys)

            this.setRightDialogVisble=true
        },
        //通过递归的形式 获取所有角色下三级权限的id 并保存到数组defkey
        getLeafKeys(node,arr){
            //判断node是否为3级
            if(!node.children){
                //三级节点的id放进数组
                return arr.push(node.id)
            }
            //不是三级 则递归获得子节点
            node.children.forEach(item => {
                this.getLeafKeys(item,arr)
            });
        },
        //监听分配权限对话框的关闭事件,清空数组
        setRightDialogClosed(){
            this.defKeys=[]
        },
        // 点击为角色分配权限
        async allotRights(){
            const keys=[
            //展开运算符
            ...this.$refs.treeRef.getCheckedKeys(),
            ...this.$refs.treeRef.getHalfCheckedKeys()
            ]
            console.log(keys)
            const idStr=keys.join(',')
            const {data:res}=await this.$http.post(`roles/${this.roleId}/rights`,{rids:idStr})
            if(res.meta.status!==200){
                return this.$message.error('分配权限失败')
            }
            this.$message.success('分配权限成功')
            this.getRolesList()
            this.setRightDialogVisble=false
        }
    }

}
</script>

<style lang="less" scoped>
.el-tag {
  margin: 7px;
}
.bdtop {
  border-top: 1px solid #eee;
}
.bdbottom {
  border-bottom: 1px solid #eee;
}
// 剧中对齐的类 谁需要给谁加 :class
.vcenter {
  display: flex;
  align-items: center;
}
</style>