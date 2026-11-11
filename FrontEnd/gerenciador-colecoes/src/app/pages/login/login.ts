import { Component, computed, inject, signal } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  ReactiveFormsModule,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { finalize } from 'rxjs';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { ErrorStateMatcher } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { AuthService } from '../../core/services/auth.service';

type Modo = 'login' | 'registro';

// Validação de senhas iguais no modo de registro
const senhasIguais: ValidatorFn = (grupo) => {
  const confirmar = grupo.get('confirmarSenha');

  if (!confirmar || confirmar.disabled) return null;

  return grupo.get('senha')?.value === confirmar.value
    ? null
    : { senhasDiferentes: true };
};

// Exibe o erro no campo de confirmação de senha
class ConfirmarSenhaMatcher implements ErrorStateMatcher {
  isErrorState(control: AbstractControl | null): boolean {
    const erroNoGrupo = !!control?.parent?.hasError('senhasDiferentes');
    return (
      !!control &&
      (control.invalid || erroNoGrupo) &&
      (control.touched || control.dirty)
    );
  }
}

@Component({
  imports: [
    ReactiveFormsModule,
    MatButtonModule,
    MatCardModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
  ],
  selector: 'app-login',
  styleUrl: './login.scss',
  templateUrl: './login.html',
})
export class Login {
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private auth = inject(AuthService);

  modo = signal<Modo>('login');
  registro = computed(() => this.modo() === 'registro');
  mostrarSenha = signal(false);
  confirmarSenhaMatcher = new ConfirmarSenhaMatcher();
  enviando = signal(false);
  erroApi = signal<string | null>(null);

  form = this.fb.nonNullable.group(
    {
      nome: [
        { value: '', disabled: true },
        [Validators.required, Validators.minLength(3)],
      ],
      email: ['', [Validators.required, Validators.email]],
      senha: ['', [Validators.required, Validators.minLength(6)]],
      confirmarSenha: [{ value: '', disabled: true }, [Validators.required]],
    },
    {
      validators: senhasIguais,
    },
  );

  alterarModo() {
    this.erroApi.set(null); //? limpa o erro ao trocar de modo
    const novoModo: Modo = this.registro() ? 'login' : 'registro';
    this.modo.set(novoModo);
    this.form.reset();

    // Campos desabilitados ficam fora da validação do formulário
    const { nome, confirmarSenha } = this.form.controls;
    if (novoModo == 'registro') {
      nome.enable();
      confirmarSenha.enable();
    } else {
      nome.disable();
      confirmarSenha.disable();
    }
  }

  enviar() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.erroApi.set(null);
    this.enviando.set(true);

    const { nome, email, senha } = this.form.getRawValue();

    const requisicao = this.registro()
      ? this.auth.cadastrar(nome.trim(), email.trim(), senha)
      : this.auth.login(email.trim(), senha);

    requisicao.pipe(finalize(() => this.enviando.set(false))).subscribe({
      next: () => this.router.navigate(['/home']),
      error: (erro: HttpErrorResponse) =>
        this.erroApi.set(this.mensagemDeErro(erro)),
    });
  }

  private mensagemDeErro(erro: HttpErrorResponse): string {
    switch (erro.status) {
      case 0:
        return 'Não foi possível conectar ao servidor. Tente novamente.';
      case 401:
        return 'E-mail ou senha inválidos.';
      case 409:
        return 'Este e-mail já está cadastrado.';
      case 422:
        return 'Dados inválidos. Confira os campos.';
      default:
        return 'Ocorreu um erro inesperado. Tente novamente.';
    }
  }
}
