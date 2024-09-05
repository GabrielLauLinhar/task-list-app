import { useState, useEffect } from "react";
import { auth, db } from './firebaseConfig';
import { 
  doc,
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  onSnapshot
} from 'firebase/firestore';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged
} from 'firebase/auth';
import { TextField, Button, List, ListItem, ListItemText, Container, Typography } from '@mui/material';

import "./App.css"

function App() {
  const [titulo, setTitulo] = useState("");
  const [descricao, setDescricao] = useState("");
  const [idTarefa, setIdTarefa] = useState("");

  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");

  const [tarefas, setTarefas] = useState([]);

  const [usuario, setUsuario] = useState(null);

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "tarefas"), (snapshot) => {
      const listaTarefas = snapshot.docs.map(doc => ({
        id: doc.id,
        titulo: doc.data().titulo,
        descricao: doc.data().descricao
      }));
      setTarefas(listaTarefas);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUsuario(user);
      } else {
        setUsuario(null);
      }
    });
    return () => unsubscribe();
  }, []);

  const novoUsuario = async () => {
    try {
      await createUserWithEmailAndPassword(auth, email, senha);
      setEmail("");
      setSenha("");
    } catch (error) {
      console.error("Erro ao criar usuário:", error);
    }
  };

  const logarUsuario = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, senha);
      setEmail("");
      setSenha("");
    } catch (error) {
      console.error("Erro ao fazer login:", error);
    }
  };

  const fazerLogout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Erro ao fazer logout:", error);
    }
  };

  const adicionarTarefa = async () => {
    try {
      await addDoc(collection(db, "tarefas"), {
        titulo,
        descricao
      });
      setTitulo("");
      setDescricao("");
    } catch (error) {
      console.error("Erro ao adicionar tarefa:", error);
    }
  };

  const editarTarefa = async () => {
    try {
      const tarefaRef = doc(db, "tarefas", idTarefa);
      await updateDoc(tarefaRef, {
        titulo,
        descricao
      });
      setIdTarefa("");
      setTitulo("");
      setDescricao("");
    } catch (error) {
      console.error("Erro ao editar tarefa:", error);
    }
  };

  const excluirTarefa = async (id) => {
    try {
      const tarefaRef = doc(db, "tarefas", id);
      await deleteDoc(tarefaRef);
    } catch (error) {
      console.error("Erro ao excluir tarefa:", error);
    }
  };

  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        Lista de Tarefas
      </Typography>
      {!usuario ? (
        <div>
          <TextField
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            fullWidth
          />
          <TextField
            label="Senha"
            type="password"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
            fullWidth
          />
          <Button onClick={novoUsuario}>Cadastrar</Button>
          <Button onClick={logarUsuario}>Login</Button>
        </div>
      ) : (
        <div>
          <Typography>Bem-vindo, {usuario.email}</Typography>
          <Button onClick={fazerLogout}>Sair</Button>
          <TextField
            label="Título"
            value={titulo}
            onChange={(e) => setTitulo(e.target.value)}
            fullWidth
          />
          <TextField
            label="Descrição"
            value={descricao}
            onChange={(e) => setDescricao(e.target.value)}
            fullWidth
          />
          <Button onClick={adicionarTarefa}>Adicionar Tarefa</Button>
          <TextField
            label="ID da Tarefa"
            value={idTarefa}
            onChange={(e) => setIdTarefa(e.target.value)}
            fullWidth
          />
          <Button onClick={editarTarefa}>Editar Tarefa</Button>
          <List>
            {tarefas.map((tarefa) => (
              <ListItem key={tarefa.id}>
                <ListItemText primary={tarefa.titulo} secondary={tarefa.descricao} />
                <Button onClick={() => excluirTarefa(tarefa.id)}>Excluir</Button>
              </ListItem>
            ))}
          </List>
        </div>
      )}
    </Container>
  );
}

export default App;
