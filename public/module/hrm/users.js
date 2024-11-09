$().ready(function(){
    $('#users-datatable').DataTable({
        order: [
            [0, "desc"]
        ],
        processing: true,
        serverSide: true,
        ajax: "/users/datatable",
        columns: [{
                data: '_id'
            },
            {
                data: 'name'
            },
            {
                data: 'username'
            },
            {
                data: 'role.name'
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