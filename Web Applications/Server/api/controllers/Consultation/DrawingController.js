module.exports={
	GetDrawingTemplates:function(req,res){
		Services.Drawing.GetDrawingTemplates()
		.then(function(list){
			res.ok(list);
		},function(err){
			res.serverError(err);
		})
	}
}