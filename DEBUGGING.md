# Guide de Debugging - Logo Upload

## Problème : Logo ne se sauvegarde pas sur le backend

### 🔍 Étapes de debug pour le logo :

1. **Tester l'upload** avec `debug-upload.html`
   ```bash
   # Ouvrir debug-upload.html dans le navigateur
   # Sélectionner une image et tester
   ```

2. **Vérifier les logs console** :
   - FormData est bien créé avec le fichier
   - Requête envoyée avec bon Content-Type
   - Réponse du serveur

3. **Vérifier côté backend** :
   - Les logs de réception du fichier
   - Vérifier que le dossier `uploads/logos/` existe
   - Permissions d'écriture sur le dossier

### 🔧 Solutions possibles :

#### Si le fichier n'arrive pas au backend :
```javascript
// Dans authService.ts, ajouter ces headers pour debug :
const response = await fetch(`${API_BASE_URL}/auth/register`, {
  method: 'POST',
  body: formData
  // IMPORTANT: Ne PAS ajouter Content-Type header!
});
```

#### Si le backend ne sauvegarde pas :
```bash
# Vérifier les permissions
chmod 755 uploads/logos/

# Vérifier que le dossier existe
mkdir -p uploads/logos/
```

#### Test manuel avec curl :
```bash
curl -X POST \
  -F "logo=@test-logo.png" \
  -F "username=test@test.com" \
  -F "password=test123" \
  -F "entreprise=Test Company" \
  https://modern-myrtice-mgdev-52e185a8.koyeb.app/api/auth/register
```

### 📋 Checklist Debug :

- [ ] FormData contient bien le fichier (console.log)
- [ ] Requête envoyée sans Content-Type header
- [ ] Backend reçoit le fichier (logs serveur)
- [ ] Dossier uploads/logos/ existe et accessible
- [ ] Permissions d'écriture correctes
- [ ] Multer configuré correctement
- [ ] Route /uploads accessible

### 🎯 URL Logo sur facture :

Une fois le logo uploadé, l'URL devrait être :
```
https://modern-myrtice-mgdev-52e185a8.koyeb.app/uploads/logos/logo-xxxxx.png
```

Et dans `userInfo.logo` on devrait avoir :
```
"uploads/logos/logo-xxxxx.png"
```
