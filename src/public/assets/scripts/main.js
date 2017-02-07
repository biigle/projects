biigle.$viewModel("projects-dashboard-main",function(e){new Vue({el:e,components:{volumeThumbnail:biigle.$require("projects.components.volumeThumbnail")}})}),biigle.$viewModel("projects-label-trees",function(e){var i=biigle.$require("messages.store"),t=biigle.$require("projects.project"),o=biigle.$require("api.projects");new Vue({el:e,mixins:[biigle.$require("core.mixins.loader"),biigle.$require("core.mixins.editor")],data:{labelTrees:biigle.$require("projects.labelTrees"),availableLabelTrees:[]},components:{typeahead:biigle.$require("core.components.typeahead"),loader:biigle.$require("core.components.loader")},computed:{classObject:function(){return{"panel-warning":this.editing}},hasNoLabelTrees:function(){return 0===this.labelTrees.length},labelTreeIds:function(){return this.labelTrees.map(function(e){return e.id})},attachableLabelTrees:function(){var e=this;return this.availableLabelTrees.filter(function(i){return e.labelTreeIds.indexOf(i.id)===-1})}},methods:{fetchAvailableLabelTrees:function(){o.queryAvailableLabelTrees({id:t.id}).then(this.availableLabelTreesFetched,i.handleErrorResponse)},availableLabelTreesFetched:function(e){Vue.set(this,"availableLabelTrees",e.data)},attachTree:function(e){if(e){this.startLoading();var r=this;o.attachLabelTree({id:t.id},{id:e.id}).then(function(){r.treeAttached(e)},i.handleErrorResponse).finally(this.finishLoading)}},treeAttached:function(e){for(var i=this.availableLabelTrees.length-1;i>=0;i--)this.availableLabelTrees[i].id===e.id&&this.availableLabelTrees.splice(i,1);this.labelTrees.push(e)},removeTree:function(e){this.startLoading();var r=this;o.detachLabelTree({id:t.id,label_tree_id:e.id}).then(function(){r.treeRemoved(e)},i.handleErrorResponse).finally(this.finishLoading)},treeRemoved:function(e){for(var i=this.labelTrees.length-1;i>=0;i--)this.labelTrees[i].id===e.id&&this.labelTrees.splice(i,1);this.availableLabelTrees.push(e)}},created:function(){this.$once("editing.start",this.fetchAvailableLabelTrees)}})}),biigle.$viewModel("projects-members",function(e){var i=biigle.$require("messages.store"),t=biigle.$require("projects.project"),o=biigle.$require("api.projects");new Vue({el:e,mixins:[biigle.$require("core.mixins.loader")],data:{members:biigle.$require("projects.members"),roles:biigle.$require("projects.roles"),defaultRole:biigle.$require("projects.defaultRoleId"),userId:biigle.$require("projects.userId")},components:{membersPanel:biigle.$require("core.components.membersPanel")},computed:{},methods:{attachMember:function(e){this.startLoading();var r=this;o.addUser({id:t.id,user_id:e.id},{project_role_id:e.role_id}).then(function(){r.memberAttached(e)},i.handleErrorResponse).finally(this.finishLoading)},memberAttached:function(e){this.members.push(e)},updateMember:function(e,r){this.startLoading();var s=this;o.updateUser({id:t.id,user_id:e.id},{project_role_id:r.role_id}).then(function(){s.memberUpdated(e,r)},i.handleErrorResponse).finally(this.finishLoading)},memberUpdated:function(e,i){e.role_id=i.role_id},removeMember:function(e){this.startLoading();var r=this;o.removeUser({id:t.id,user_id:e.id}).then(function(){r.memberRemoved(e)},i.handleErrorResponse).finally(this.finishLoading)},memberRemoved:function(e){for(var i=this.members.length-1;i>=0;i--)this.members[i].id===e.id&&this.members.splice(i,1)}}})}),biigle.$viewModel("projects-title",function(e){var i=biigle.$require("messages.store"),t=biigle.$require("projects.project"),o=biigle.$require("api.projects");new Vue({el:e,mixins:[biigle.$require("core.mixins.loader"),biigle.$require("core.mixins.editor")],data:{project:t,name:t.name,description:t.description},computed:{hasDescription:function(){return!!this.description.length},isChanged:function(){return this.name!==this.project.name||this.description!==this.project.description}},methods:{discardChanges:function(){this.name=this.project.name,this.description=this.project.description,this.finishEditing()},leaveProject:function(){var e=confirm("Do you really want to leave the project "+this.project.name+"?");e&&(this.startLoading(),o.removeUser({id:this.project.id,user_id:biigle.$require("projects.userId")}).then(this.projectLeft,i.handleErrorResponse).finally(this.finishLoading))},projectLeft:function(){i.success("You left the project. Redirecting..."),setTimeout(function(){location.href=biigle.$require("projects.redirectUrl")},2e3)},deleteProject:function(){var e=confirm("Do you really want to delete the project "+this.project.name+"?");e&&(this.startLoading(),o.delete({id:this.project.id}).then(this.projectDeleted,this.maybeForceDeleteProject).finally(this.finishLoading))},maybeForceDeleteProject:function(e){if(400===e.status){var t=confirm("Deleting this project will delete one or more volumes with all annotations! Do you want to continue?");t&&(this.startLoading(),o.delete({id:this.project.id},{force:!0}).then(this.projectDeleted,i.handleErrorResponse).finally(this.finishLoading))}else i.handleErrorResponse(e)},projectDeleted:function(){i.success("The project was deleted. Redirecting..."),setTimeout(function(){location.href=biigle.$require("projects.redirectUrl")},2e3)},saveChanges:function(){this.startLoading(),o.update({id:this.project.id},{name:this.name,description:this.description}).then(this.changesSaved,i.handleErrorResponse).finally(this.finishLoading)},changesSaved:function(){this.project.name=this.name,this.project.description=this.description,this.finishEditing()}}})}),biigle.$viewModel("projects-show-volume-list",function(e){var i=biigle.$require("api.projects"),t=biigle.$require("api.attachableVolumes"),o=biigle.$require("messages.store");new Vue({el:e,mixins:[biigle.$require("core.mixins.loader"),biigle.$require("core.mixins.editor")],data:{project:biigle.$require("projects.project"),volumes:biigle.$require("projects.volumes"),attachableVolumes:[]},components:{volumeThumbnail:biigle.$require("projects.components.volumeThumbnail"),typeahead:biigle.$require("core.components.typeahead")},methods:{removeVolume:function(e){var t=this;this.startLoading(),i.detachVolume({id:this.project.id,volume_id:e}).then(function(){t.volumeRemoved(e)},function(i){400===i.status?confirm("The volume you are about to remove belongs only to this project and will be deleted. Are you sure you want to delete this volume?")&&t.forceRemoveVolume(e):o.handleErrorResponse(i)}).finally(this.finishLoading)},forceRemoveVolume:function(e){var t=this;this.startLoading(),i.detachVolume({id:this.project.id,volume_id:e},{force:!0}).then(function(){t.volumeRemoved(e)},o.handleErrorResponse).finally(this.finishLoading)},volumeRemoved:function(e){for(var i=this.volumes.length-1;i>=0;i--)this.volumes[i].id===e&&(this.attachableVolumes.unshift(this.volumes[i]),this.volumes.splice(i,1))},hasVolume:function(e){for(var i=this.volumes.length-1;i>=0;i--)if(this.volumes[i].id===e)return!0;return!1},attachVolume:function(e){if(e&&!this.hasVolume(e.id)){var t=this;this.startLoading(),i.attachVolume({id:this.project.id,volume_id:e.id},{}).then(function(){t.volumeAttached(e)},o.handleErrorResponse).finally(this.finishLoading)}},volumeAttached:function(e){this.volumes.unshift(e);for(var i=this.attachableVolumes.length-1;i>=0;i--)this.attachableVolumes[i].id===e.id&&this.attachableVolumes.splice(i,1)},fetchAttachableVolumes:function(){t.get({id:this.project.id}).then(this.attachableVolumesFetched,o.handleErrorResponse)},attachableVolumesFetched:function(e){this.attachableVolumes=e.data}},created:function(){this.$once("editing.start",this.fetchAttachableVolumes)}})}),biigle.$component("projects.components.volumeThumbnail",{template:'<figure class="volume-thumbnail" v-bind:class="{loading: loading}" v-on:mouseover="fetchUuids" v-on:mousemove="updateIndex($event)" v-on:click="clearTimeout" v-on:mouseout="clearTimeout"><span class="volume-thumbnail__close close" v-if="removable" v-on:click.prevent="remove" v-bind:title="removeTitle">&times;</span><slot></slot><div class="volume-thumbnail__images" v-if="initialized"><img v-on:error="failed[i] = true" v-bind:class="{hidden: thumbHidden(i)}" v-bind:src="thumbUri(uuid)" v-for="(uuid, i) in uuids"></div><slot name="caption"></slot><span class="volume-thumbnail__progress" v-bind:style="{width: progress}"></span></figure>',props:{tid:{type:Number,required:!0},uri:{type:String,required:!0},format:{type:String,required:!0},removable:{type:Boolean,default:!1},removeTitle:{type:String,default:"Remove this volume"}},data:function(){return{uuids:[],initialized:!1,loading:!1,index:0,failed:[],timeoutId:null}},computed:{progress:function(){return this.initialized?100*this.index/(this.uuids.length-1)+"%":this.loading?"100%":"0%"}},methods:{fetchUuids:function(){if(!this.initialized&&!this.loading){var e=biigle.$require("api.volumeSample"),i=this;i.loading=!0,i.timeoutId=setTimeout(function(){e.get({id:i.tid}).then(function(e){e.ok&&(i.uuids=e.data,i.initialized=!0)}).finally(function(){i.loading=!1})},1e3)}},thumbUri:function(e){return this.uri+"/"+e+"."+this.format},thumbHidden:function(e){return this.index!==e||this.failed[e]},updateIndex:function(e){var i=this.$el.getBoundingClientRect();this.index=Math.floor(this.uuids.length*(e.clientX-i.left)/i.width)},clearTimeout:function(){this.timeoutId&&(clearTimeout(this.timeoutId),this.timeoutId=null,this.loading=!1)},remove:function(){this.clearTimeout(),this.$emit("remove",this.tid)}}}),biigle.$declare("api.attachableVolumes",Vue.resource("api/v1/projects{/id}/attachable-volumes")),biigle.$declare("api.volumeSample",Vue.resource("api/v1/volumes{/id}/sample{/number}"));