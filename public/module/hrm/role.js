$().ready(function(){
    $('#roles-datatable').DataTable({
        order: [
            [0, "desc"]
        ],
        processing: true,
        serverSide: true,
        ajax: "/roles/datatable",
        columns: [{
                data: '_id'
            },
            {
                data: 'name'
            },
            {
                data: 'createdAt'
            },
            {
                data: 'action',
            }
        ],
        dom: 'Bfrtip',
        buttons: [
            'copy', 'csv', 'excel', 'pdf', 'print'
        ]
    });
});