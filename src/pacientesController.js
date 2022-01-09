export default class PacientesController {

    editModal = new bootstrap.Modal(document.getElementById("edit-modal"));
    editToast = new bootstrap.Toast(document.getElementById("edit_toast"));
    deleteToast = new bootstrap.Toast(document.getElementById("delete_toast"))

    constructor(seletor, model) {
        this.seletor = seletor; // id do tbody
        this.model = model;

        this.setupForm();
        this.setupAdd();
    }

    setupForm() {
        $("#telefone, #telefone_edit").mask("(00) 00000-0000");
        $("#cpf, #cpf_edit").mask("000.000.000-00");
        //(FIXES, máscaras para os campos de CEP e RG)
        $("#rg, #rg_edit").mask("0.000.000")
        $("#cep, #cep_edit").mask("00000-000")

        $("#edit_paciente").submit((e) => {
            e.preventDefault();

            const inputs = $("#edit_paciente").serializeArray();
            const id = Number(inputs[0].value);
            const data = {
                nome: inputs[1].value,
                email: inputs[2].value,
                telefone: inputs[3].value,
                cpf: inputs[4].value,
                rg: inputs[5].value,
                cep: inputs[6].value
            }; 

            this.model.edit(id, data);
            this.build();
            this.editModal.hide();
            this.editToast.show({ autohide: true});
            $("#edit_paciente input").val("");
        });
    }

    setupAdd() {
        $("#add_paciente").submit((e) => {
            e.preventDefault();
            const inputs = $("#add_paciente").serializeArray(); // cria um array para cada input
            const data = {};

            inputs.forEach((input) => {
                data[input.name] = input.value;                
            });
            this.model.add(data);
            $("#add_paciente input").val("");
            const db_paciente = JSON.parse(localStorage.getItem('db_paciente')) ?? []
            db_paciente.push (data);
            localStorage.setItem("db_paciente", JSON.stringify(db_paciente))
            this.build();
        });
    }

    setupEdit(paciente) {
        $(`#btn-edit-${paciente.id}`).click(() => {
            $("#id").val(paciente.id);
            $("#nome_edit").val(paciente.nome);
            $("#email_edit").val(paciente.email);
            $("#telefone_edit").val(paciente.telefone);
            $("#cpf_edit").val(paciente.cpf);
            //Add Rg e Cep modal edit
            $("#rg_edit").val(paciente.rg);
            $("#cep_edit").val(paciente.cep);

            this.editModal.show();
        })
    }

    setupDelete(paciente) {
        $(`#btn-del-${paciente.id}`).click(() => {
            if(confirm("Você deseja deletar o cadastro do Paciente ?") === true) {
                this.model.delete(paciente.id);
                this.build();
                this.deleteToast.show();
            } 
        });
    }

    validarBootstrap() {
        (function () {
            'use strict'
        
            // Fetch all the forms we want to apply custom Bootstrap validation styles to
            var forms = document.querySelectorAll('.needs-validation')
        
            // Loop over them and prevent submission
            Array.prototype.slice.call(forms)
            .forEach(function (form) {
                form.addEventListener('submit', function (event) {
                if (!form.checkValidity()) {
                    event.preventDefault()
                    event.stopPropagation()
                }
        
                form.classList.add('was-validated')
                }, false)
            })
        })()
    }

    build () {
        if(this.model.pacientes.length > 0) {
            $("#table").removeClass("d-none")
            $("#tableVazia").addClass("d-none")
        } else {
            $("#table").addClass("d-none")
            $("#tableVazia").removeClass("d-none")
        }
        $(this.seletor).empty();
        this.validarBootstrap();
        this.model.pacientes.forEach((paciente) => {
            $(this.seletor).append(`
            <tr>
                <td>${paciente.id}</td>
                <td>${paciente.nome}</td>
                <td>${paciente.email}</td>
                <td>${paciente.telefone}</td>
                <td>${paciente.cpf}</td>
                <td>${paciente.rg}</td>
                <td>${paciente.cep}</td>
                <td class="text-center">
                    <button id="btn-edit-${paciente.id}" class="btn btn-warning btn-sm">
                        <i class="bi bi-pencil-fill"></i>
                    </button>
                    <button id="btn-del-${paciente.id}" class="btn btn-danger btn-sm">
                        <i class="bi bi-trash-fill"></i>
                    </button>
                </td>
            </tr>
            `)
            
            this.setupEdit(paciente);
            this.setupDelete(paciente);
        });
    }
}